import prisma from "../src/lib/prisma";
import { ProductStatus } from "../src/generated/prisma/client";
import process from "node:process";

async function main() {
  const categories = ["Living Room", "Bedroom", "Office", "Dining", "Kitchen"];
  const types = ["Sofas", "Chairs", "Tables", "Beds", "Desks", "Storage", "Lighting", "Decor"];

  console.log("Cleaning up existing data...");
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.type.deleteMany();

  console.log("Seeding categories and types...");

  // Create Categories
  const catModels = await Promise.all(
    categories.map((name) =>
      prisma.category.create({
        data: { name },
      })
    )
  );

  // Create Types
  const typeModels = await Promise.all(
    types.map((name) =>
      prisma.type.create({
        data: { name },
      })
    )
  );

  const products = [
    {
      name: "Nordia Velvet Sofa",
      description: "Luxurious velvet sofa with deep seating and elegant tapered legs. Perfect for modern living rooms.",
      price: 899.99,
      discount: 15,
      rating: 5,
      inventory: 12,
      categoryName: "Living Room",
      typeName: "Sofas",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Eames Style Lounge Chair",
      description: "Iconic mid-century design with premium leather and walnut veneer. Includes matching ottoman.",
      price: 1249.99,
      discount: 0,
      rating: 5,
      inventory: 5,
      categoryName: "Living Room",
      typeName: "Chairs",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Minimalist Oak Desk",
      description: "Clean lines and solid oak construction make this desk a perfect addition to any home office.",
      price: 499.99,
      discount: 10,
      rating: 4,
      inventory: 20,
      categoryName: "Office",
      typeName: "Desks",
      imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Industrial Dining Table",
      description: "Reclaimed wood top with sturdy steel legs. Seats up to 6 people comfortably.",
      price: 649.99,
      discount: 0,
      rating: 4,
      inventory: 8,
      categoryName: "Dining",
      typeName: "Tables",
      imageUrl: "https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Cloud Bed Frame",
      description: "Fully upholstered bed frame with a soft, cloud-like headboard. Includes slatted base.",
      price: 1100.00,
      discount: 20,
      rating: 5,
      inventory: 15,
      categoryName: "Bedroom",
      typeName: "Beds",
      imageUrl: "https://images.unsplash.com/photo-1505693419148-433060e1856e?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Ergonomic Mesh Chair",
      description: "Breathable mesh back with adjustable lumbar support and 4D armrests for ultimate comfort.",
      price: 349.99,
      discount: 5,
      rating: 4,
      inventory: 50,
      categoryName: "Office",
      typeName: "Chairs",
      imageUrl: "https://images.unsplash.com/photo-1505797149-43b000051ca4?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Marble Top Coffee Table",
      description: "Elegant Carrara marble top with a brushed gold geometric base.",
      price: 299.99,
      discount: 0,
      rating: 4,
      inventory: 18,
      categoryName: "Living Room",
      typeName: "Tables",
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Walnut Nightstand",
      description: "Sleek walnut nightstand with two soft-close drawers and integrated cable management.",
      price: 179.99,
      discount: 0,
      rating: 5,
      inventory: 25,
      categoryName: "Bedroom",
      typeName: "Storage",
      imageUrl: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Floating Bookshelf",
      description: "Modern minimalist bookshelf that gives the illusion of floating. Solid birch wood.",
      price: 129.99,
      discount: 10,
      rating: 4,
      inventory: 40,
      categoryName: "Office",
      typeName: "Storage",
      imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Modern Floor Lamp",
      description: "Arc-style floor lamp with a linen shade and a heavy marble base. Dimmable LED.",
      price: 149.99,
      discount: 0,
      rating: 4,
      inventory: 30,
      categoryName: "Living Room",
      typeName: "Lighting",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Oak Dining Chair",
      description: "Solid oak chair with a curved backrest for ergonomic support. Set of 2.",
      price: 249.99,
      discount: 0,
      rating: 5,
      inventory: 16,
      categoryName: "Dining",
      typeName: "Chairs",
      imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Leather Pouf",
      description: "Hand-stitched Moroccan leather pouf. Great as an extra seat or footrest.",
      price: 89.99,
      discount: 0,
      rating: 4,
      inventory: 22,
      categoryName: "Living Room",
      typeName: "Decor",
      imageUrl: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&q=80&w=800"
    }
  ];

  console.log("Seeding products...");
  for (const p of products) {
    const category = catModels.find(c => c.name === p.categoryName);
    const type = typeModels.find(t => t.name === p.typeName);

    if (!category || !type) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        discount: p.discount,
        rating: p.rating,
        status: ProductStatus.PUBLISHED,
        inventory: p.inventory,
        categoryId: category.id,
        typeId: type.id,
        images: {
          create: [
            { url: p.imageUrl }
          ]
        }
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
