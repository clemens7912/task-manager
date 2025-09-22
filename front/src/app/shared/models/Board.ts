import { Column } from "./column"
import { User } from "./user"

export interface Board {
    id: number,
    name: string,
    createdAt: string, 
    updatedAt: string,
    users?: User[],
    columns: Column[]
}