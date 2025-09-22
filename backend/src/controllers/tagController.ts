import { Tags } from './../models/Tags';
import { Request, Response } from "express";


export const createTag = async (req: Request, res: Response) => {
    try {
        const {name, color, boardId} = req.body;

        const tag = await Tags.create({name, color, boardId});

        res.status(200).json(tag);
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

export const updateTag = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {name, color} = req.body;

    try{
        await Tags.update(
            {name, color},
            {
                where: {id}
            }
        );

        res.status(200);
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

export const getTags = async (req: Request, res: Response) => {
    const boardId = req.query.boardId;
    try {
        if(!boardId){
            res.status(400).json({'message': 'Board ID needed'});
            return;
        }

        const tags = await Tags.findAll({
            where: {
                boardId
            }
        });

        res.status(200).json(tags);
    } catch (error: unknown) {
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

export const deleteTag = async (req: Request, res: Response) => {
    const id = req.params.id;

    try{    
        await Tags.destroy({
            where: {id}
        });

        res.status(204).send();
    }catch (error: unknown) {
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