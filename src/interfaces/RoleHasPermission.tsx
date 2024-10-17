import { Permission } from "./Permission"
import { Role } from "./Role"
export interface RoleHasPermission {
    roleId: string
    permissionId: string
    permission?:Permission
    role?: Role
}