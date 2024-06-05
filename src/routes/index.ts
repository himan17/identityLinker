import { Router } from "express";
import identityRoutes from "./identityRoutes";

const router = Router();

router.use("/contact", identityRoutes);

export default router;
