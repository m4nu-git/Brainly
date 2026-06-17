import { Request, Response } from "express";
import { TagService } from "../services/tag.service";
import { asyncHandler } from "../utils/asyncHandler";

export const TagController = {
  createTag: asyncHandler(async (req: Request, res: Response) => {
    const result = await TagService.createTag(req.body.name, req.userId!);
    if ("conflict" in result) {
      res.status(409).json({ message: "Tag already exists" });
      return;
    }
    res.status(201).json({ message: "Tag created", tag: result.tag });
  }),

  getTags: asyncHandler(async (req: Request, res: Response) => {
    const tags = await TagService.getTags(req.userId!);
    res.json({ tags });
  }),

  deleteTag: asyncHandler(async (req: Request, res: Response) => {
    const result = await TagService.deleteTag(req.params.id, req.userId!);
    if ("notFound" in result) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.json({ message: "Tag deleted" });
  }),
};
