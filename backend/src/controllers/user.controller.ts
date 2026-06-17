import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

export const UserController = {
  signup: asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const result = await UserService.signup(username, password);
    if ("conflict" in result) {
      res.status(409).json({ message: "Username already taken" });
      return;
    }
    res.status(201).json({ message: "User created successfully" });
  }),

  signin: asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const result = await UserService.signin(username, password);
    if ("invalidCredentials" in result) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }
    res.status(200).json({
      message: "Signed in successfully",
      username: result.username,
      token: result.token,
    });
  }),
};
