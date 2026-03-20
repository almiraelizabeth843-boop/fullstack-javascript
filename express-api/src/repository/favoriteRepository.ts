import prisma from "../lib/prisma";

export const toggleFavorite = async (userId: string, productId: string) => {
    const existing = await prisma.favorite.findFirst({
        where: {
            userId,
            productId,
        },
    });

    if (existing) {
        await prisma.favorite.deleteMany({
            where: {
                userId,
                productId,
            },
        });
        return { favorited: false };
    } else {
        await prisma.favorite.create({
            data: {
                userId,
                productId,
            },
        });
        return { favorited: true };
    }
};

export const getFavorites = async (userId: string) => {
    return await prisma.favorite.findMany({
        where: { 
            userId 
        },
        include: {
            product: {
                include: {
                    images: true,
                    category: true,
                    type: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
