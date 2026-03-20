import { Request, Response } from "express";
import * as favoriteRepository from "../../repository/favoriteRepository";

export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const session = (req as any).session;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const result = await favoriteRepository.toggleFavorite(session.user.id, productId);
        res.json(result);
    } catch (error) {
        console.error("Error toggling favorite:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const session = (req as any).session;
        const favorites = await favoriteRepository.getFavorites(session.user.id);
        res.json(favorites);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
