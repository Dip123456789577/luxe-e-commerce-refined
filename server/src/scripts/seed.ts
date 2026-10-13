import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { Coupon } from "../models/Coupon";
import { Order } from "../models/Order";
import { Review } from "../models/Review";
import { connectDB } from "../config/db";

export async function seedDatabase() {
  console.log("[Seed] Starting luxury database seeding...");

  // 1. Categories
  const categoriesData = [
    {
      name: "Clothing",
      slug: "clothing",
      description: "Normandy linen, 3D seamless merino knits, and sandwashed silk.",
      order: 1,
    },
    {
      name: "Bags",
      slug: "bags",
      description: "Full-grain Tuscan vegetable-tanned leather carryalls.",
      order: 2,
    },
    {
      name: "Home",
      slug: "home",
      description: "Hand-thrown regional stoneware, cashmere throws, and botanical scents.",
      order: 3,
    },
    {
      name: "Jewelry",
      slug: "jewelry",
      description: "Solid 18k recycled gold vermeil and silver pieces.",
      order: 4,
    },
    {
      name: "Shoes",
      slug: "shoes",
      description: "Blake-stitched French calfskin loafers.",
      order: 5,
    },
  ];

  for (const cat of categoriesData) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
  }

  // 2. Products
  const productsData = [
    {
      name: "The Linen Dress",
      slug: "the-linen-dress",
      sku: "LX-CLO-001",
      category: "Clothing",
      price: 148,
      stock: 24,
      subtitle: "A summer essential, considered.",
      badge: "Bestseller",
      colors: ["Ivory", "Olive", "Black"],
      sizes: ["XS", "S", "M", "L", "XL"],
      rating: 4.9,
      reviewsCount: 38,
      description:
        "Cut from certified Normandy flax linen, featuring a sculpted waistline and a natural, fluid drape. Tailored with French interior seams for an unhurried silhouette.",
      craftsmanship:
        "Garment-washed for a soft broken-in feel. Finished with mother-of-pearl buttons.",
      materials: "100% European Certified Flax Linen (190 gsm)",
      care: "Gentle machine wash cold with gentle detergent. Line dry in shade.",
      origin: "Woven in Normandy, tailored in Porto, Portugal",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    {
      name: "Everyday Shoulder Bag",
      slug: "everyday-shoulder-bag",
      sku: "LX-BAG-002",
      category: "Bags",
      price: 195,
      compareAt: 240,
      stock: 18,
      subtitle: "Supple Tuscan leather, engineered for utility.",
      badge: "New arrival",
      colors: ["Cognac", "Noir Black", "Chalk"],
      sizes: ["One size"],
      rating: 4.8,
      reviewsCount: 24,
      description:
        "An understated sculptural bag crafted from vegetable-tanned full-grain leather. Finished with brushed palladium hardware and an interior cotton canvas zip pocket.",
      craftsmanship: "Hand-burnished edge paint and reinforced stress points ensure longevity.",
      materials: "100% Tuscan Full-Grain Vegetable-Tanned Leather",
      care: "Condition semi-annually with natural beeswax leather cream.",
      origin: "Handcrafted in Florence, Italy",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    {
      name: "The Soft Knit Crew",
      slug: "the-soft-knit",
      sku: "LX-CLO-003",
      category: "Clothing",
      price: 168,
      stock: 15,
      subtitle: "Extra-fine merino with an effortless drape.",
      badge: "Iconic",
      colors: ["Oat", "Charcoal", "Sage"],
      sizes: ["XS", "S", "M", "L", "XL"],
      rating: 4.9,
      reviewsCount: 29,
      description:
        "Spun from ultra-fine 19.5-micron Australian merino wool. Knit at a featherweight gauge with delicate ribbed collar.",
      craftsmanship: "Seamless whole-garment 3D knitting technology eliminates seam friction.",
      materials: "100% Traceable Extra-Fine Merino Wool",
      care: "Hand wash in cool water with wool wash. Lay flat to dry.",
      origin: "Spun in Biella, Italy",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    {
      name: "Sculpted Ceramic Vessel",
      slug: "sculpted-vase",
      sku: "LX-HOM-004",
      category: "Home",
      price: 86,
      stock: 12,
      subtitle: "Raw stoneware, tactile form.",
      badge: "Made by hand",
      colors: ["Chalk", "Stone Gray"],
      sizes: ["Standard (24cm)", "Grand (32cm)"],
      rating: 4.7,
      reviewsCount: 16,
      description:
        "Hand-thrown ceramic vase with subtle organic asymmetry. Matte exterior textured slip glaze and watertight interior.",
      craftsmanship: "Fired in wood-burning kilns over 36 hours.",
      materials: "Coarse regional stoneware with mineral slip glaze",
      care: "Rinse with lukewarm water and mild soap.",
      origin: "Crafted in Kyoto, Japan",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    {
      name: "Weekend Merino Cardigan",
      slug: "weekend-knit",
      sku: "LX-CLO-005",
      category: "Clothing",
      price: 178,
      compareAt: 210,
      stock: 9,
      subtitle: "Generous ribbed detailing, horn buttons.",
      colors: ["Oat", "Sage", "Charcoal"],
      sizes: ["XS", "S", "M", "L", "XL"],
      rating: 4.8,
      reviewsCount: 18,
      description:
        "A slouchy cardigan knit from chunky carded merino. Features dropped shoulders and natural horn buttons.",
      materials: "100% RWS Certified Merino Wool",
      origin: "Knitted in Hawick, Scotland",
      images: [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    {
      name: "Solstice Hammered Pendant",
      slug: "solstice-gold-pendant",
      sku: "LX-JWL-006",
      category: "Jewelry",
      price: 220,
      compareAt: 260,
      stock: 14,
      subtitle: "Recycled 18k solid gold vermeil over 925 silver.",
      badge: "Atelier Edition",
      colors: ["18k Gold", "Sterling Silver"],
      sizes: ["45cm Chain", "50cm Chain"],
      rating: 5.0,
      reviewsCount: 21,
      description:
        "An organic disc pendant delicately hand-hammered by master jewelers in Arezzo, Italy.",
      materials: "Recycled 18k Yellow Gold Vermeil, 925 Sterling Silver",
      origin: "Crafted in Arezzo, Italy",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1611591475152-4c4897f7fa20?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    {
      name: "Tailored Silk Blouse",
      slug: "silk-atelier-shirt",
      sku: "LX-CLO-007",
      category: "Clothing",
      price: 210,
      stock: 11,
      subtitle: "Heavyweight mulberry silk with matte sandwashed finish.",
      badge: "New arrival",
      colors: ["Champagne", "Noir Black", "Ivory"],
      sizes: ["XS", "S", "M", "L", "XL"],
      rating: 4.9,
      reviewsCount: 22,
      description: "A classic collared button-down with clean covered plackets and French cuffs.",
      materials: "100% Grade 6A Mulberry Silk",
      origin: "Paris, France",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    {
      name: "The Essential Leather Loafer",
      slug: "minimalist-leather-loafer",
      sku: "LX-SHO-008",
      category: "Shoes",
      price: 265,
      compareAt: 320,
      stock: 8,
      subtitle: "Glove leather with Blake-stitched leather sole.",
      badge: "Bestseller",
      colors: ["Noir Black", "Burgundy", "Cognac"],
      sizes: ["36 EU", "37 EU", "38 EU", "39 EU", "40 EU", "41 EU"],
      rating: 4.8,
      reviewsCount: 31,
      description:
        "Molded around an almond-toe wooden last. Supple French calfskin upper with cushioned leather insole.",
      materials: "Full-Grain French Calfskin, Leather Sole",
      origin: "Montegranaro, Italy",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    {
      name: "Cedar & Amber Botanical Candle",
      slug: "amber-botanical-candle",
      sku: "LX-HOM-009",
      category: "Home",
      price: 58,
      stock: 40,
      subtitle: "Hand-poured coconut wax with pure botanical oils.",
      badge: "Hand poured",
      colors: ["Amber Glass", "Smoked Onyx"],
      sizes: ["280g (65 Hours Burn)"],
      rating: 4.9,
      reviewsCount: 42,
      description:
        "A slow-burning room fragrance evoking aged cedar panels, smoked frankincense, and warm amber resin.",
      materials: "100% Sustainable Coconut & Rapeseed Wax",
      origin: "Grasse, France",
      images: [
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=85",
      ],
    },
  ];

  for (const item of productsData) {
    await Product.findOneAndUpdate({ slug: item.slug }, item, { upsert: true, new: true });
  }

  // 3. Admin Account (Secure bootstrap)
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash("AdminPassword2026!", salt);
  await User.findOneAndUpdate(
    { email: "admin@atelier-luxe.com" },
    {
      name: "Atelier Director",
      email: "admin@atelier-luxe.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isActive: true,
      isEmailVerified: true,
    },
    { upsert: true },
  );

  // 4. Customer Demo Account
  const customerPasswordHash = await bcrypt.hash("CustomerPassword2026!", salt);
  const customer = await User.findOneAndUpdate(
    { email: "clara.moreau@atelier-luxe.com" },
    {
      name: "Clara Moreau",
      email: "clara.moreau@atelier-luxe.com",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      isActive: true,
      isEmailVerified: true,
      addresses: [
        {
          fullName: "Clara Moreau",
          street: "740 Park Avenue",
          apartment: "Apt 11B",
          city: "New York",
          state: "NY",
          postalCode: "10021",
          country: "United States",
          phone: "+1 (212) 555-0198",
          isDefault: true,
        },
      ],
    },
    { upsert: true, new: true },
  );

  // 5. Coupons
  await Coupon.findOneAndUpdate(
    { code: "WELCOME10" },
    {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 0,
      isActive: true,
    },
    { upsert: true },
  );

  await Coupon.findOneAndUpdate(
    { code: "LUXE20" },
    {
      code: "LUXE20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderValue: 150,
      isActive: true,
    },
    { upsert: true },
  );

  // 6. Initial Seed Order
  const firstProduct = await Product.findOne({ slug: "the-linen-dress" });
  if (firstProduct && customer) {
    const existingOrder = await Order.findOne({ orderNumber: "LX-100201" });
    if (!existingOrder) {
      await Order.create({
        orderNumber: "LX-100201",
        userId: customer._id,
        customerEmail: customer.email,
        customerName: customer.name,
        customerPhone: "+1 (212) 555-0198",
        items: [
          {
            productId: firstProduct._id,
            name: firstProduct.name,
            slug: firstProduct.slug,
            image: firstProduct.images[0],
            price: firstProduct.price,
            size: "M",
            color: "Ivory",
            quantity: 1,
          },
        ],
        shippingAddress: customer.addresses[0],
        shippingMethod: "Priority Express Courier",
        shippingFee: 0,
        subtotal: 148,
        discount: 0,
        total: 148,
        paymentStatus: "PAID",
        paymentProvider: "DEMO",
        fulfillmentStatus: "CONFIRMED",
        timeline: [
          {
            status: "CONFIRMED",
            timestamp: new Date(),
            note: "Order confirmed in European atelier.",
          },
        ],
      });
    }
  }

  console.log("[Seed] Database seeding completed successfully!");
}

// Standalone execution if run directly via tsx
if (process.argv[1]?.includes("seed.ts")) {
  void (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
