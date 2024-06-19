import { Router } from "express";
import { MemberController } from "../controllers/MemberController";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/register", MemberController.register);
router.post("/login", MemberController.login);
router.get("/profile", auth, MemberController.getProfile);

export default router;
