import { Router } from "express";
import { userMiddleware } from "../middleware/auth";
import { ContentController } from "../controllers/content.controller";
import { validate } from "../middleware/validate";
import {
  addContentSchema,
  updateContentSchema,
  deleteContentSchema,
  contentIdParamSchema,
  contentQuerySchema,
} from "../schemas/content.schema";

const router = Router();

router.post("/", userMiddleware, validate(addContentSchema), ContentController.addContent);
router.get("/", userMiddleware, validate(contentQuerySchema, "query"), ContentController.getContent);
router.put("/:id", userMiddleware, validate(contentIdParamSchema, "params"), validate(updateContentSchema), ContentController.updateContent);
router.delete("/", userMiddleware, validate(deleteContentSchema), ContentController.deleteContent);

export default router;
