import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole, UserStatus } from "@prisma/client"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { prisma } from "@/lib/db/prisma"
import { logger } from "@/lib/logger"

// Module augmentations are handled in types/next-auth.d.ts

// Use type assertion to bypass NextAuth v5 beta compatibility issues with Prisma adapter
const customPrismaAdapter = PrismaAdapter(prisma) as any

// Override the createUser method to handle username field
if (customPrismaAdapter.createUser) {
  const _originalCreateUser = customPrismaAdapter.createUser;
  customPrismaAdapter.createUser = async (user: any) => {
    logger.info('createUser called', {
      metadata: {
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      }
    });

    // Generate a default username if not provided
    let username = user.username;
    if (!username) {
      if (user.email) {
        username = user.email.split('@')[0].toLowerCase();
      } else if (user.name) {
        username = user.name.toLowerCase().replace(/\s+/g, '_');
      } else {
        username = `user_${user.id.slice(-6)}`;
      }

      // Ensure username is unique
      let finalUsername = username;
      let counter = 1;
      while (true) {
        const existingUser = await prisma.user.findUnique({
          where: { username: finalUsername },
        });
        if (!existingUser) break;
        finalUsername = `${username}_${counter}`;
        counter++;
      }
      username = finalUsername;
    }

    // Handle email for GitHub OAuth users (email might be null)
    let email = user.email;
    if (!email && user.name) {
      // Generate a temporary email for GitHub users without public email
      email = `${username}@github.local`;
    }

    const userData = {
      ...user,
      email: email || `${username}@github.local`,
      username,
      role: 'STUDENT' as UserRole,
      status: 'ACTIVE' as UserStatus,
    };

    logger.info('createUser data prepared', {
      metadata: {
        userId: userData.id,
        email: userData.email,
        username: userData.username,
        role: userData.role,
        status: userData.status
      }
    });

    // Create user with username and email
    const createdUser = await prisma.user.create({
      data: userData,
    });

    logger.info('createUser successful', {
      metadata: {
        userId: createdUser.id,
        email: createdUser.email,
        username: createdUser.username
      }
    });

    return createdUser;
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: customPrismaAdapter,
  trustHost: true,
  providers: [
    Google,
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email"
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password"
        }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const email = credentials.email as string
          const password = credentials.password as string

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              // Exclude image to prevent large JWT cookies
              password: true,
              role: true,
              status: true,
              cohortId: true,
              emailVerified: true,
              avatar: true,
            }
          })

          if (!user?.password) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          // Return user object with all required fields
          // Note: Exclude image/avatar to prevent large JWT cookies
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            cohortId: user.cohortId,
            avatar: user.avatar,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          logger.error("Error during authentication", error instanceof Error ? error : new Error(String(error)));
          return null;
        }
      }
    }
    )
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Handle GitHub OAuth errors
      if (account?.provider === "github") {
        if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
          logger.warn("GitHub OAuth configuration missing", {
            metadata: {
              hasClientId: !!process.env.AUTH_GITHUB_ID,
              hasClientSecret: !!process.env.AUTH_GITHUB_SECRET
            }
          });
          return false;
        }

        // Log successful GitHub sign-in
        logger.info("GitHub OAuth sign-in attempt", {
          userId: user.id,
          metadata: {
            userEmail: user.email,
            userName: user.name
          }
        });
      }

      return true;
    },
    async session({ session, token }) {
      // Add user data from token to session with proper typing
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role
        session.user.status = token.status
        // cohortId and avatar will be fetched from database when needed
        // This keeps the JWT token small to prevent HTTP 431 errors
      }

      return session
    },
    async jwt({ token, user }) {
      // For credentials provider, user data is already complete
      if (user) {
        // Store only essential data to keep JWT small
        token.role = user.role
        token.status = user.status
        // Remove cohortId and avatar from JWT to reduce size
        // These will be fetched from database when needed
      }
      // For existing tokens, fetch from database if needed
      else if (token.sub && !token.role) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true, status: true },
          })

          if (dbUser) {
            token.role = dbUser.role
            token.status = dbUser.status
          } else {
            // Set defaults
            token.role = "STUDENT" as UserRole
            token.status = "ACTIVE" as UserStatus
          }
        } catch (error) {
          logger.error("Error fetching user data in JWT callback", error instanceof Error ? error : new Error(String(error)))
          // Set defaults on error
          token.role = "STUDENT" as UserRole
          token.status = "ACTIVE" as UserStatus
        }
      }

      return token
    },
  },
  events: {
    async createUser({ user }) {
      // User creation is now handled in the adapter override
      logger.info("User created successfully", {
        userId: user.id,
        metadata: {
          userEmail: user.email,
          userName: user.name
        }
      });
    },
  },
});
