//import { Request, Response, NextFunction } from "express";
import { User } from "../types/user";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()


// export const cookieAuthCheck = (req: Request, res: Response, next: NextFunction) => {
//     const { isAuthenticated } = req.signedCookies
//     if (isAuthenticated) {
//         next()
//     } else {
//         res.status(403).send("403")
//     }
// }



const JWT_SECRET = process.env.JET_SECRET || "default_secret"


export function generateToken(user: User): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): User | null {
    try {
        return jwt.verify(token, JWT_SECRET) as User;
    } catch (err) {
        return null;
    }
}