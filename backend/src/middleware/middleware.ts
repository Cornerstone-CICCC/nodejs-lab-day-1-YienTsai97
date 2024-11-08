import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth';
import { User } from '../types/user';


export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(403).json({ message: 'Invalid token' });
        return
    }

    req.user = decoded as User;
    next();
}
