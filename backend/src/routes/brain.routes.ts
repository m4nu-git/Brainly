import { Router } from "express";
import { userMiddleware } from "../middleware/auth";
import { BrainController } from "../controllers/brain.controller";
import { validate } from "../middleware/validate";
import { shareBrainSchema } from "../schemas/brain.schema";

const router = Router();

router.post("/share", userMiddleware, validate(shareBrainSchema), BrainController.shareLink);
router.get("/:shareLink", BrainController.getSharedBrain);

export default router;
