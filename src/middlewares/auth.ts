import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JwtPayload } from '../types/interfaces';

declare module "express" {
    interface Request {
        member?: JwtPayload;
        id?: number;
    }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied - No token provided');

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        return res.status(500).send('Internal Server Error - JWT secret not configured');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.member = decoded;
        req.id = decoded.id;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).send('Access expired - Token has expired');
        }

        if (error instanceof JsonWebTokenError) {
            return res.status(401).send('Access denied - Invalid token');
        }

        return res.status(500).send('Internal Server Error - Failed to authenticate token');
    }
};
