import { RoleHasPermission } from "./RoleHasPermission"
import { UserHasRole } from "./userHasRole"
export interface Role {
    id: string
    name: string
    description: string
    roleHasPermission?: RoleHasPermission[]
    userHasRole? : UserHasRole
}