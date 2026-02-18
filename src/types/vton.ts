import { User } from "./user";
export interface VTON {
    id: string;
    uncleaned_outfit?: string;
    cleaned_outfit?: string;
    user_snap?: string;
    outfit_try_on?: string;
    user_id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface VTONWithRelations extends VTON {
    user: User;
}