import prisma from "../lib/prisma";

export const getProducts = async () => {
    return await prisma.product.findMany();
};

export const createProduct = async (data: any) => {
    const productData: any = {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        inventory: data.inventory,
        category: {
            connectOrCreate: {
                where: { name: data.category },
                create: { name: data.category },
            },
        },
        type: {
            connectOrCreate: {
                where: { name: data.type },
                create: { name: data.type },
            },
        },
    };

    if (data.imageUrl) {
        productData.images = {
            create: [
                { url: data.imageUrl }
            ]
        };
    }

    return await prisma.product.create({ data: productData });
};
