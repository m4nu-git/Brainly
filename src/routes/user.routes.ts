import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { signupSchema, signinSchema } from "../schemas/user.schema";

const router = Router();

router.post("/signup", validate(signupSchema), UserController.signup);
router.post("/signin", validate(signinSchema), UserController.signin);

export default router;
