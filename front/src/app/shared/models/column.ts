import { Board } from './Board';
import { Card } from './card';

export interface Column {
    id: number, 
    name: string, 
    boardId: number,
    board?: Board,
    cards?: Card[]
}