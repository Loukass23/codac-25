import type { UserRole, UserStatus } from "@prisma/client"
import type { DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            role: UserRole
            status: UserStatus
        }
    }

    interface User extends DefaultUser {
        role: UserRole
        status: UserStatus
        emailVerified: Date | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole
        status: UserStatus
    }
} 