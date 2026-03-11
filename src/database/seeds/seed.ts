import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User } from '../../auth/entities/user.entity';
import { StylePreference } from '../../profile/entities/style-preference.entity';
import { Category } from '../../products/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { Banner } from '../../home/entities/banner.entity';
import { ShippingOption } from '../../checkout/entities/shipping-option.entity';
import { ShippingAddress } from '../../checkout/entities/shipping-address.entity';
import { FitProfile } from '../../profile/entities/fit-profile.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { TryOnResult } from '../../try-on/entities/try-on-result.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Review } from '../../products/entities/review.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [
    User, StylePreference, Category, Product, ProductVariant, Review,
    Banner, ShippingOption, ShippingAddress, FitProfile,
    Cart, CartItem, Order, OrderItem, TryOnResult, Notification,
  ],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('🌱 Seeding database...');

  // Style Preferences
  const prefRepo = dataSource.getRepository(StylePreference);
  const prefNames = ['Casual', 'Formal', 'Streetwear', 'Minimalist', 'Bohemian', 'Sporty', 'Vintage', 'Preppy'];
  const prefs: StylePreference[] = [];
  for (const name of prefNames) {
    let p = await prefRepo.findOne({ where: { name } });
    if (!p) { p = await prefRepo.save(prefRepo.create({ name })); }
    prefs.push(p);
  }
  console.log('✅ Style preferences seeded');

  // Categories
  const catRepo = dataSource.getRepository(Category);
  const categories = [
    { name: 'Tops', slug: 'tops', icon_url: null },
    { name: 'Bottoms', slug: 'bottoms', icon_url: null },
    { name: 'Dresses', slug: 'dresses', icon_url: null },
    { name: 'Outerwear', slug: 'outerwear', icon_url: null },
    { name: 'Accessories', slug: 'accessories', icon_url: null },
    { name: 'Footwear', slug: 'footwear', icon_url: null },
  ];
  const savedCategories: Category[] = [];
  for (const cat of categories) {
    let c = await catRepo.findOne({ where: { name: cat.name } });
    if (!c) { c = await catRepo.save(catRepo.create(cat)); }
    savedCategories.push(c);
  }
  console.log('✅ Categories seeded');

  // Banners
  const bannerRepo = dataSource.getRepository(Banner);
  const count = await bannerRepo.count();
  if (count === 0) {
    await bannerRepo.save([
      bannerRepo.create({ image_url: 'https://placehold.co/800x300?text=New+Arrivals', title: 'New Arrivals', subtitle: 'Shop the latest collection', deep_link: '/products?featured=true' }),
      bannerRepo.create({ image_url: 'https://placehold.co/800x300?text=Summer+Sale', title: 'Summer Sale', subtitle: 'Up to 50% off', deep_link: '/products?category=Dresses' }),
      bannerRepo.create({ image_url: 'https://placehold.co/800x300?text=AI+Try-On', title: 'Try Before You Buy', subtitle: 'Experience AI Virtual Try-On', deep_link: '/try-on' }),
    ]);
  }
  console.log('✅ Banners seeded');

  // Shipping Options
  const shippingRepo = dataSource.getRepository(ShippingOption);
  const shippingCount = await shippingRepo.count();
  if (shippingCount === 0) {
    await shippingRepo.save([
      shippingRepo.create({ courier: 'JNE', service: 'Regular', cost: 15000, estimated_days: 3 }),
      shippingRepo.create({ courier: 'JNE', service: 'Express', cost: 25000, estimated_days: 1 }),
      shippingRepo.create({ courier: 'TIKI', service: 'Regular', cost: 12000, estimated_days: 4 }),
      shippingRepo.create({ courier: 'SiCepat', service: 'Regular', cost: 14000, estimated_days: 2 }),
      shippingRepo.create({ courier: 'SiCepat', service: 'Express', cost: 22000, estimated_days: 1 }),
    ]);
  }
  console.log('✅ Shipping options seeded');

  // Sample Products
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);
  const productCount = await productRepo.count();
  if (productCount === 0) {
    const sampleProducts = [
      {
        name: 'Classic White Oversized Tee',
        description: 'A timeless oversized white t-shirt made from 100% premium cotton. Perfect for casual everyday wear.',
        price: 199000,
        discount_price: 149000,
        category: 'Tops',
        images: ['https://placehold.co/400x500?text=White+Tee'],
        rating: 4.5,
        review_count: 128,
        stock: 50,
        is_featured: true,
        has_ai_try_on: true,
        variants: [
          { size: 'S', color: 'White', stock: 10, additional_price: null },
          { size: 'M', color: 'White', stock: 15, additional_price: null },
          { size: 'L', color: 'White', stock: 15, additional_price: null },
          { size: 'XL', color: 'White', stock: 10, additional_price: null },
        ],
      },
      {
        name: 'High-Waist Slim Jeans',
        description: 'Flattering high-waist slim fit jeans in classic blue denim. Versatile and comfortable.',
        price: 349000,
        discount_price: null,
        category: 'Bottoms',
        images: ['https://placehold.co/400x500?text=Slim+Jeans'],
        rating: 4.3,
        review_count: 64,
        stock: 30,
        is_featured: true,
        has_ai_try_on: true,
        variants: [
          { size: '26', color: 'Blue', stock: 5, additional_price: null },
          { size: '28', color: 'Blue', stock: 10, additional_price: null },
          { size: '30', color: 'Blue', stock: 10, additional_price: null },
          { size: '32', color: 'Blue', stock: 5, additional_price: null },
        ],
      },
      {
        name: 'Floral Maxi Dress',
        description: 'Elegant floral print maxi dress, perfect for beach days or summer outings.',
        price: 429000,
        discount_price: 329000,
        category: 'Dresses',
        images: ['https://placehold.co/400x500?text=Maxi+Dress'],
        rating: 4.7,
        review_count: 92,
        stock: 25,
        is_featured: true,
        has_ai_try_on: true,
        variants: [
          { size: 'S', color: 'Floral Pink', stock: 5, additional_price: null },
          { size: 'M', color: 'Floral Pink', stock: 10, additional_price: null },
          { size: 'L', color: 'Floral Pink', stock: 10, additional_price: null },
        ],
      },
      {
        name: 'Minimalist Leather Jacket',
        description: 'A sleek black faux-leather jacket that elevates any outfit. Timeless and versatile.',
        price: 699000,
        discount_price: null,
        category: 'Outerwear',
        images: ['https://placehold.co/400x500?text=Leather+Jacket'],
        rating: 4.8,
        review_count: 45,
        stock: 15,
        is_featured: false,
        has_ai_try_on: true,
        variants: [
          { size: 'S', color: 'Black', stock: 3, additional_price: null },
          { size: 'M', color: 'Black', stock: 5, additional_price: null },
          { size: 'L', color: 'Black', stock: 5, additional_price: null },
          { size: 'XL', color: 'Black', stock: 2, additional_price: null },
        ],
      },
    ];

    for (const p of sampleProducts) {
      const { variants, ...productData } = p;
      const product = productRepo.create(productData);
      const savedProduct = await productRepo.save(product);
      for (const v of variants) {
        const variant = variantRepo.create({ ...v, product: savedProduct });
        await variantRepo.save(variant);
      }
    }
  }
  console.log('✅ Products seeded');

  // Demo user
  const userRepo = dataSource.getRepository(User);
  let demoUser = await userRepo.findOne({ where: { email: 'demo@stylo.id' } });
  if (!demoUser) {
    const password_hash = await bcrypt.hash('password123', 10);
    demoUser = await userRepo.save(
      userRepo.create({
        email: 'demo@stylo.id',
        name: 'Demo User',
        password_hash,
        style_preferences: [prefs[0], prefs[2]],
      }),
    );

    // Add a sample shipping address for demo user
    const addrRepo = dataSource.getRepository(ShippingAddress);
    await addrRepo.save(
      addrRepo.create({
        user: demoUser,
        receiver_name: 'Demo User',
        phone: '08123456789',
        street: 'Jl. Sudirman No. 1',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postal_code: '10220',
        is_default: true,
        label: 'Home',
      }),
    );
  }
  console.log('✅ Demo user seeded (email: demo@stylo.id, password: password123)');

  await dataSource.destroy();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
