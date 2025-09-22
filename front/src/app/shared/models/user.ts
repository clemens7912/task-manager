import { BoardUsers } from "./boardUsers";
import { Card } from "./card";
import { Role } from "./role";

export interface User {
    id: number,
    name: string, 
    email: string,
    role: Role,
    boardUsers?: BoardUsers[],
    cards?: Card[]
}