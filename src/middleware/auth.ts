import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JwtPayloadWithId extends JwtPayload {
  id: string;
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers["authorization"];
  if (!header) {
    res.status(401).json({ message: "Authorization token required" });
    return;
  }
  try {
    const decoded = jwt.verify(header, process.env.JWT_SECRET as string) as JwtPayloadWithId;
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
