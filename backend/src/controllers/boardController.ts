import { User } from './../models/User';
import { BoardUser } from './../models/BoardUser';
import { BoardRoles } from './../models/BoardRoles';
import { Board } from './../models/Board';
import { Request, Response } from "express";
import sequelize from './../config/database';
import { Op } from 'sequelize';

export const checkAccess = (req: Request, res: Response) => {
    res.status(200).send();
}

export const createBoard = async (req: Request, res: Response) => {
    const name = req.body.name;
    const members = req.body.members as User[];

    const transaction = await sequelize.transaction();

    try{
        //create board
        const board = await Board.create({
            name
        });

        //Add board owner (current user)
        await BoardUser.create({
            userId: req.userId,
            boardId: board.id,
            roleId: 1
        });

        //Add board members to junction table
        if(members){
            for(const member of members){
                await BoardUser.create({
                    userId: member.id,
                    boardId: board.id,
                    roleId: 2
                });
            }
        }

        transaction.commit();

        res.status(200).json(board);
    }catch(error){
        transaction.rollback();
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

/**
 * Returns user list to be used in text filed suggesiton
 * It filters based on param received and extracts the current user
 */
export const getUserBoards = async (req: Request, res: Response) => {
    try{
        const boards = await Board.findAll({
            include: [
                {
                    model: BoardUser,
                    where: { userId: req.userId },
                    required: true,
                    attributes: []
                }
            ]
        });

        res.status(200).json(boards);
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

export const getBoard = async (req: Request, res: Response) => {
    const boardId = req.params.id;
    try {
        const board = await Board.findOne({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                    through: {attributes: []},
                    required: true,
                    include: [
                        {
                            model: BoardUser,
                            attributes: ["roleId"], 
                            where: {boardId: boardId},
                            required:true,
                            include: [
                                {
                                    model: BoardRoles, 
                                    attributes: ["name"],
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                id: {
                    [Op.eq]: boardId
                }
            }
        });

        res.status(200).json(board);
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

export const addMember = async (req: Request, res: Response) => {
    const {userId, boardId} = req.body;

    try{
        await BoardUser.create({userId, boardId});

        res.status(201).send();
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

export const deleteMember = async (req: Request, res: Response) => {
    const {userId, boardId} = req.body;

    try{
        await BoardUser.destroy({
            where: {userId, boardId}
        });

        res.status(204).send();
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