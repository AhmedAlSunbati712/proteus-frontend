import { VTON } from "./vton";
export interface User {
    id: string;
    user_name: string;
    email: string;
    password: string;
}

export interface UserWithRelations extends User {
    vtons: VTON[];
}