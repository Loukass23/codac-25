import type { UserRole, UserStatus } from "@prisma/client"
import type { DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            username: string
            role: UserRole
            status: UserStatus
            cohortId?: string | null
            avatar?: string | null
            emailVerified?: Date | null
        }
    }

    interface User extends DefaultUser {
        username: string
        role: UserRole
        status: UserStatus
        emailVerified: Date | null
        cohortId?: string | null
        avatar?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username: string
        role: UserRole
        status: UserStatus
        cohortId?: string | null
        avatar?: string | null
        emailVerified?: Date | null
        invalid?: boolean
    }
} 