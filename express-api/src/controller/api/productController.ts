import { Request, Response } from "express";
import * as productRepository from "../../repository/productRepository";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        const limit = parseInt(req.query.limit as string) || 8;
        const cursor = req.query.cursor as string | undefined;

        const products = await productRepository.getProducts(limit, cursor, session?.user?.id);
        
        const productsWithFavorite = products.map((p: any) => ({
            ...p,
            isFavorite: p.favorites ? p.favorites.length > 0 : false,
            favorites: undefined, // Clean up the response
        }));

        const lastProduct = productsWithFavorite[productsWithFavorite.length - 1];
        const nextCursor = (productsWithFavorite.length === limit && lastProduct) 
            ? lastProduct.id 
            : null;

        res.json({
            data: productsWithFavorite,
            nextCursor: nextCursor,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
