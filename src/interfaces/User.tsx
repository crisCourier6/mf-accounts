import { Expert } from "./Expert";
import { Store } from "./Store";
import { UserHasRole } from "./userHasRole";

export interface User {
    id: string,
    email?: string,
    name?: string,
    hash?: string,
    isActive?: boolean,
    isSuspended?: boolean,
    isPending?: boolean,
    activationToken?: string,
    activationExpire?: string,
    profilePic?: string,
    typeExternal?: string,
    externalId?: string,
    lastLogin?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    storeProfile?: Store,
    expertProfile?: Expert,
    userHasRole?: UserHasRole[]
    roles?:string
}