import express from "express";
import { createProduct } from "../controller/admin/productController";
import { upload } from "../middleware/upload";

const router = express.Router()

router.post("/products/create", upload.single('image'), createProduct);

export default router;