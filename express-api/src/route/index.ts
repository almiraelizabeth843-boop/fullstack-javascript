import express from "express";

import adminRoute from "./adminRoute";
import apiRoute from "./apiRoute";
import { authGuard, adminAuth } from "../middleware/auth";

const router = express.Router();

router.use("/api/v1/admin", adminAuth, adminRoute);
router.use("/api/v1", authGuard, apiRoute);

export default router;