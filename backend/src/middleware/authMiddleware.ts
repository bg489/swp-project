import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }
        req.userId = decoded.id;
        next();
    });
};

export default verifyToken;