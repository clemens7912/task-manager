import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: number
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.session?.token;

    if(!token){
        res.status(403).json({
            'message': 'No token provided'
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as TokenPayload;
        req.userId = decoded.id;
        next();
    }catch(error: unknown){
        console.log(error);
        res.status(403).json({
            'message': 'Invalid token'
        });
    }
}