import express from "express";

import * as productController from "../controller/api/productController";
import * as favoriteController from "../controller/api/favoriteController";
import { authGuard } from "../middleware/auth";

const router = express.Router()

router.get("/products", productController.getProducts);

// Favorite routes
router.post("/favorites/toggle", authGuard, favoriteController.toggleFavorite);
router.get("/favorites", authGuard, favoriteController.getFavorites);

export default router;