import { Role } from "./Role"
import { User } from "./User"

export interface UserHasRole {
    roleId: string
    userId: string
    activeRole: boolean
    role: Role
    user: User
}