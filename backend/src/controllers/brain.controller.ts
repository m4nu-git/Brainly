import { Request, Response } from "express";
import { BrainService } from "../services/brain.service";
import { asyncHandler } from "../utils/asyncHandler";

export const BrainController = {
  shareLink: asyncHandler(async (req: Request, res: Response) => {
    const result = await BrainService.shareLink(req.userId!, req.body.share);
    if ("removed" in result) {
      res.json({ message: "Share link removed" });
      return;
    }
    res.json({ hash: result.hash });
  }),

  getSharedBrain: asyncHandler(async (req: Request, res: Response) => {
    const result = await BrainService.getSharedBrain(req.params.shareLink);
    if ("notFound" in result) {
      res.status(404).json({ message: "Share link not found" });
      return;
    }
    if ("userNotFound" in result) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    res.json({ username: result.username, content: result.content });
  }),
};
