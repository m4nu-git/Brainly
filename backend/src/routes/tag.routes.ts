import { Router } from "express";
import { userMiddleware } from "../middleware/auth";
import { TagController } from "../controllers/tag.controller";
import { validate } from "../middleware/validate";
import { createTagSchema, tagIdParamSchema } from "../schemas/tag.schema";

const router = Router();

router.post("/", userMiddleware, validate(createTagSchema), TagController.createTag);
router.get("/", userMiddleware, TagController.getTags);
router.delete("/:id", userMiddleware, validate(tagIdParamSchema, "params"), TagController.deleteTag);

export default router;
