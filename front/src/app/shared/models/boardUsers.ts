import { BoardRoles } from "./boardRoles";

export interface BoardUsers {
    userId: number, 
    boardId: number, 
    roleId: number, 
    boardRoles: BoardRoles
}