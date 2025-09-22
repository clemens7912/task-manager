import { Column } from "./column";
import { Tag } from "./tag";
import { User } from "./user";

export interface Card {
    id?: number,
    tags: Tag[],
    column?: Column,
    shortDescription: string, 
    longDescription: string,
    startDate: string, 
    endDate: string, 
    users: User[]
}