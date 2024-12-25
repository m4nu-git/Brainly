import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

import dotenv from "dotenv";
dotenv.config();

interface JwtPyloadWithId extends JwtPayload {
    id: string;
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_PASSWORD as string) as JwtPyloadWithId;
    if (decoded) {
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({
            warning: "Your are not logged in"
        })
    }
}