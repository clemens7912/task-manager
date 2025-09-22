import { Columns } from './../models/Columns';
import { NextFunction, Request, Response } from "express";
import { BoardUser } from "./../models/BoardUser";
import { Cards } from "./../models/Cards";

export const isBoardMember = async (req: Request, res: Response, next: NextFunction) => {
    const boardId = req.params.id || req.query.boardId || req.body.boardId;

    try{
        const count = await BoardUser.count({
            where: {
                boardId: boardId, 
                userId: req.userId
            }
        });

        if(count == 0){
            res.status(403).json({message: `Not authorized for board ${boardId}`});
            return;
        }

        next();
    }catch(error: unknown){
        console.log(error);
        res.status(403).json({
            message: `Not authorized for board ${boardId}`
        });
    }
}

export const isBoardOwner = async (req: Request, res: Response, next: NextFunction) => {
    const boardId = req.params.boardId || req.query.boardId || req.body.boardId;

    try{
        const count = await BoardUser.count({
            where: {
                boardId: boardId, 
                userId: req.userId,
                roleId: 1
            }
        });

        if(count == 0){
            res.status(403).json({message: `Not owner of the board ${boardId}`});
            return;
        }

        next();
    }catch(error: unknown){
        console.log(error);
        res.status(403).json({
            message: `Not authorized for board ${boardId}`
        });
    }
}

/**
 * Checks if user belongs to the same board as the card
 * @param req 
 * @param res 
 * @param next 
 */
export const isCardMember = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let boardId: number | undefined; 
    try{
        if(id){
            boardId = (await Cards.findOne({
                where: {id},
                attributes: [],
                include: [
                    {
                        model: Columns,
                        attributes: ['boardId']
                    }
                ]
            }))?.column.boardId;
        }else{
            const card = (req.body as Cards);
            boardId = card.column.boardId;
        }

        if(!boardId){
            res.status(403).json({message: `Not authorized for board ${boardId}`});
            return;
        }

        const count = await BoardUser.count({
            where: {
                boardId: boardId, 
                userId: req.userId
            }
        });

        if(count == 0){
            res.status(403).json({message: `Not authorized for board ${boardId}`});
            return;
        }

        next();
    }catch(error: unknown){
        console.log(error);
        res.status(403).json({
            message: `Not authorized for board ${boardId || ''}`
        });
    }
}