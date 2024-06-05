import { Router } from "express";
import { identityLinker } from "../controllers";

const router = Router();

router.post("/identify", identityLinker);

export default router;
