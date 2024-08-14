export interface UserFull {
    id:string
    email?:string
    name?:string
    hash?:string
    isActive?:boolean
    isSuspended?:boolean
    activationToken?:string
    activationExpire?:Date
    profilePic?:string
    typeExternal?:string
    externalId?:string
    lastLogin?:string
    createdAt?:string
    updatedAt?:Date
    roles?:string[]
}