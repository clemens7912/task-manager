import { BoardRoles } from './../models/BoardRoles';
import { BoardUser } from './../models/BoardUser';
import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Roles } from "./../models/Roles";
import { Op } from "sequelize";

export const register = async (req: Request, res: Response) => {

    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({
            where: {'email': email}
        });

        if(user){
            res.status(400).json({
                'message': 'Email already in use'
            });
            return; 
        }

        user = await User.create({
            'name': name, 
            'email': email,
            'password': bcrypt.hashSync(password, 10),
        });

        res.status(201).json({
            'message': 'User registered successfully'
        });
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

export const login = async (req: Request, res: Response) => {
    const {email, password} = await req.body;

    try{
        const user = await User.findOne({
            where: {
                'email': email
            },
            include: Roles
        });

        if(!user){
            res.status(404).json({
                'message': 'User not found'
            });
            return;
        }

        if(!bcrypt.compareSync(password, user.password)){
            res.status(401).json({
                'message': 'Incorrect password'
            });
            return;
        }

        const token = jwt.sign(
            {'id': user.id}, 
            process.env.SECRET_KEY!,
            {
                'algorithm': 'HS256',
                'expiresIn': 7*24*60*60,
                'allowInsecureKeySizes': true
            }
        );

        req.session!.token = token;

        const {password: pwd, ...userWithoutPwd} = user.get({plain: true});

        res.status(200).json(userWithoutPwd);

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

export const refreshSession = (req: Request, res: Response) => {
    res.status(200).json({'message': `Session active, user ${req.userId}`});
}

export const logout = (req: Request, res: Response) => {
    try{
        req.session = null;
        res.status(200).json({
            'message': 'Logged out successfully'
        });
    }catch(error: unknown){
        if(error instanceof Error){
            console.log(error.stack);
            res.status(500).json({
                'message': error.message
            });
        }else{
            console.log(error);
            res.status(500).json({
                'message':'Error logging out'
            });
        }
    }
}

export const getUsers = async (req: Request, res: Response) => {
    const user = req.query.user || '';
    const limit = +req.query.limit!;
    
    try{
        const users = await User.findAll({
            where: {
                name: {
                    [Op.like]: `${user}%`                    
                }
            },
            limit: limit,
        });

        res.status(200).json(users);
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