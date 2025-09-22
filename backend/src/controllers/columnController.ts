import { User } from './../models/User';
import { Tags } from './../models/Tags';
import { Cards } from './../models/Cards';
import { Columns } from './../models/Columns';
import { Request, Response } from "express";

/**
 * Creates a column. Expects name and boardId in body params
 * @param req 
 * @param res 
 */
export const createColumn = async (req: Request, res: Response) => {
    try{
        const {name, boardId} = req.body;

        const column = await Columns.create({
            name,
            boardId
        });

        res.status(200).json(column);
    }catch(error: unknown){
        if(error instanceof Error){
            console.log(error.stack);
            res.status(500).json({
                'message': error.message
            });
        }else{
            console.log(error);
            res.status(500).json({
                'message':'Error en servidor'
            });
        }
    }

}

export const getColumns = async (req: Request, res: Response) => {
    const {boardId} = req.query;
    try{
        const columns = await Columns.findAll({
            where: {boardId},
        });

        res.status(200).json(columns);
    } catch(error: unknown){
        if(error instanceof Error){
            console.log(error.stack);
            res.status(500).json({
                'message': error.message
            });
        }else{
            console.log(error);
            res.status(500).json({
                'message':'Error en servidor'
            });
        }
    }
}