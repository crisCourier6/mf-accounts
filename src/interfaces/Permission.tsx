import { RoleHasPermission } from "./RoleHasPermission"

export interface Permission {
    id: string
    name: string
    description: string
    roleHasPermission?: RoleHasPermission
}