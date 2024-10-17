import { User } from "./User";
export interface Expert {
    id: string,
    address?: string,
    description?: string,
    phone?: string,
    webPage?: string,
    specialty?: string,
    isCoach?: boolean,
    isNutritionist?: boolean,
    userId: string,
    recommendationCount?:number
    userLikes?:boolean
    userComments?:boolean
    user?: User
}