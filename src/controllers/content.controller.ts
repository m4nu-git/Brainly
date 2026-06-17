import { Request, Response } from "express";
import { ContentService } from "../services/content.service";
import { asyncHandler } from "../utils/asyncHandler";
import type { ContentQuery } from "../schemas/content.schema";

export const ContentController = {
  addContent: asyncHandler(async (req: Request, res: Response) => {
    const { link, title, type, tags, content } = req.body;
    await ContentService.addContent(title, type, link, req.userId!, tags, content);
    res.status(201).json({ message: "Content added successfully" });
  }),

  getContent: asyncHandler(async (req: Request, res: Response) => {
    const filters = req.query as unknown as ContentQuery;
    const content = await ContentService.getContent(req.userId!, filters);
    res.json({ content });
  }),

  updateContent: asyncHandler(async (req: Request, res: Response) => {
    const { title, type, link, tags } = req.body;
    const result = await ContentService.updateContent(req.params.id, req.userId!, {
      title,
      type,
      link,
      tags,
    });
    if ("notFound" in result) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    res.json({ message: "Content updated", content: result.content });
  }),

  deleteContent: asyncHandler(async (req: Request, res: Response) => {
    await ContentService.deleteContent(req.body.contentId, req.userId!);
    res.json({ message: "Deleted" });
  }),
};
