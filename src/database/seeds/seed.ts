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
    User,
    StylePreference,
    Category,
    Product,
    ProductVariant,
    Review,
    Banner,
    ShippingOption,
    ShippingAddress,
    FitProfile,
    Cart,
    CartItem,
    Order,
    OrderItem,
    TryOnResult,
    Notification,
  ],
  synchronize: true,
});

// Product images from Picsum (reliable for development)
const PRODUCT_IMAGES = {
  tops: [
    'https://picsum.photos/seed/toptee1/400/500',
    'https://picsum.photos/seed/toptee2/400/500',
    'https://picsum.photos/seed/hoodie1/400/500',
    'https://picsum.photos/seed/hoodie2/400/500',
    'https://picsum.photos/seed/shirt1/400/500',
  ],
  bottoms: [
    'https://picsum.photos/seed/jeans1/400/500',
    'https://picsum.photos/seed/jeans2/400/500',
    'https://picsum.photos/seed/cargo1/400/500',
    'https://picsum.photos/seed/cargo2/400/500',
  ],
  dresses: [
    'https://picsum.photos/seed/dress1/400/500',
    'https://picsum.photos/seed/dress2/400/500',
    'https://picsum.photos/seed/dress3/400/500',
    'https://picsum.photos/seed/dress4/400/500',
    'https://picsum.photos/seed/dress5/400/500',
  ],
  outerwear: [
    'https://picsum.photos/seed/jacket1/400/500',
    'https://picsum.photos/seed/jacket2/400/500',
    'https://picsum.photos/seed/denim1/400/500',
    'https://picsum.photos/seed/denim2/400/500',
  ],
  footwear: [
    'https://picsum.photos/seed/sneaker1/400/500',
    'https://picsum.photos/seed/sneaker2/400/500',
    'https://picsum.photos/seed/sneaker3/400/500',
    'https://picsum.photos/seed/sneaker4/400/500',
  ],
  accessories: [
    'https://picsum.photos/seed/watch1/400/500',
    'https://picsum.photos/seed/bag1/400/500',
    'https://picsum.photos/seed/bag2/400/500',
  ],
};

const BANNER_IMAGES = [
  'https://picsum.photos/seed/banner1/800/300',
  'https://picsum.photos/seed/banner2/800/300',
  'https://picsum.photos/seed/banner3/800/300',
];

async function seed() {
  await dataSource.initialize();
  console.log('🌱 Seeding database...');

  // Clear existing data (in correct order due to foreign key constraints)
  console.log('🗑️  Clearing existing data...');
  await dataSource.query('TRUNCATE TABLE reviews CASCADE');
  await dataSource.query('TRUNCATE TABLE product_variants CASCADE');
  await dataSource.query('TRUNCATE TABLE products CASCADE');
  await dataSource.query('TRUNCATE TABLE banners CASCADE');
  await dataSource.query('TRUNCATE TABLE categories CASCADE');
  await dataSource.query('TRUNCATE TABLE style_preferences CASCADE');
  await dataSource.query('TRUNCATE TABLE user_style_preferences CASCADE');
  await dataSource.query('TRUNCATE TABLE shipping_addresses CASCADE');
  await dataSource.query('TRUNCATE TABLE shipping_options CASCADE');
  await dataSource.query('TRUNCATE TABLE notifications CASCADE');
  await dataSource.query('TRUNCATE TABLE cart_items CASCADE');
  await dataSource.query('TRUNCATE TABLE carts CASCADE');
  await dataSource.query('TRUNCATE TABLE order_items CASCADE');
  await dataSource.query('TRUNCATE TABLE orders CASCADE');
  await dataSource.query('TRUNCATE TABLE try_on_results CASCADE');
  await dataSource.query('TRUNCATE TABLE fit_profiles CASCADE');
  // Delete users except we'll recreate demo user
  await dataSource.query('DELETE FROM users');
  console.log('✅ Existing data cleared');

  // Style Preferences
  const prefRepo = dataSource.getRepository(StylePreference);
  const prefNames = [
    'Casual',
    'Formal',
    'Streetwear',
    'Minimalist',
    'Bohemian',
    'Sporty',
    'Vintage',
    'Preppy',
  ];
  const prefs: StylePreference[] = [];
  for (const name of prefNames) {
    let p = await prefRepo.findOne({ where: { name } });
    if (!p) {
      p = await prefRepo.save(prefRepo.create({ name }));
    }
    prefs.push(p);
  }
  console.log('✅ Style preferences seeded');

  // Categories
  const catRepo = dataSource.getRepository(Category);
  const categories = [
    {
      name: 'Tops',
      slug: 'tops',
      icon_url: 'https://cdn-icons-png.flaticon.com/512/863/863696.png',
    },
    {
      name: 'Bottoms',
      slug: 'bottoms',
      icon_url: 'https://cdn-icons-png.flaticon.com/512/1693/1693786.png',
    },
    {
      name: 'Dresses',
      slug: 'dresses',
      icon_url: 'https://cdn-icons-png.flaticon.com/512/3561/3561777.png',
    },
    {
      name: 'Outerwear',
      slug: 'outerwear',
      icon_url: 'https://cdn-icons-png.flaticon.com/512/2265/2265538.png',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      icon_url: 'https://cdn-icons-png.flaticon.com/512/3050/3050257.png',
    },
    {
      name: 'Footwear',
      slug: 'footwear',
      icon_url: 'https://cdn-icons-png.flaticon.com/512/2554/2554931.png',
    },
  ];
  const savedCategories: Category[] = [];
  for (const cat of categories) {
    let c = await catRepo.findOne({ where: { name: cat.name } });
    if (!c) {
      c = (await catRepo.save(catRepo.create(cat))) as Category;
    }
    savedCategories.push(c);
  }
  console.log('✅ Categories seeded');

  // Banners
  const bannerRepo = dataSource.getRepository(Banner);
  await bannerRepo.save([
    bannerRepo.create({
      image_url: BANNER_IMAGES[0],
      title: 'New Arrivals',
      subtitle: 'Discover the latest fashion trends',
      deep_link: '/products?featured=true',
    }),
    bannerRepo.create({
      image_url: BANNER_IMAGES[1],
      title: 'Summer Collection',
      subtitle: 'Up to 50% off on selected items',
      deep_link: '/products?category=Dresses',
    }),
    bannerRepo.create({
      image_url: BANNER_IMAGES[2],
      title: 'AI Virtual Try-On',
      subtitle: 'See how it looks before you buy',
      deep_link: '/try-on',
    }),
  ]);
  console.log('✅ Banners seeded');

  // Shipping Options
  const shippingRepo = dataSource.getRepository(ShippingOption);
  await shippingRepo.save([
    shippingRepo.create({
      courier: 'JNE',
      service: 'Regular',
      cost: 15000,
      estimated_days: 3,
    }),
    shippingRepo.create({
      courier: 'JNE',
      service: 'Express',
      cost: 25000,
      estimated_days: 1,
    }),
    shippingRepo.create({
      courier: 'TIKI',
      service: 'Regular',
      cost: 12000,
      estimated_days: 4,
    }),
    shippingRepo.create({
      courier: 'SiCepat',
      service: 'Regular',
      cost: 14000,
      estimated_days: 2,
    }),
    shippingRepo.create({
      courier: 'SiCepat',
      service: 'Express',
      cost: 22000,
      estimated_days: 1,
    }),
  ]);
  console.log('✅ Shipping options seeded');

  // Dynamic Product Generation (100 products)
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);

  const productNames = {
      tops: [
        'Oversized Tee',
        'Streetwear Hoodie',
        'Button-Down Shirt',
        'Polo Shirt',
        'Knit Sweater',
        'Denim Shirt',
        'Graphic T-Shirt',
        'Tank Top',
      ],
      bottoms: [
        'Slim Jeans',
        'Cargo Pants',
        'Chino Trousers',
        'Jogger Pants',
        'Denim Shorts',
        'Tailored Pants',
        'Corduroy Trousers',
      ],
      dresses: [
        'Maxi Dress',
        'Bodycon Dress',
        'Wrap Dress',
        'Cocktail Dress',
        'Sun Dress',
        'Evening Gown',
        'Shirt Dress',
      ],
      outerwear: [
        'Leather Jacket',
        'Denim Jacket',
        'Puffer Coat',
        'Windbreaker',
        'Trench Coat',
        'Bomber Jacket',
        'Wool Coat',
      ],
      footwear: [
        'White Sneakers',
        'High-Top Sneakers',
        'Running Shoes',
        'Leather Boots',
        'Chelsea Boots',
        'Loafers',
        'Sandals',
      ],
      accessories: [
        'Leather Watch',
        'Canvas Tote Bag',
        'Sunglasses',
        'Leather Belt',
        'Beanie Hat',
        'Silver Necklace',
        'Backpack',
      ],
    };

    const adjectives = [
      'Classic',
      'Urban',
      'Minimalist',
      'Elegant',
      'Vintage',
      'Modern',
      'Premium',
      'Casual',
      'Luxury',
      'Essential',
    ];
    const colors = [
      'White',
      'Black',
      'Gray',
      'Navy',
      'Olive',
      'Khaki',
      'Burgundy',
      'Beige',
      'Blue',
      'Red',
    ];
    const sizes = {
      clothes: ['S', 'M', 'L', 'XL'],
      pants: ['28', '30', '32', '34', '36'],
      shoes: ['38', '39', '40', '41', '42', '43', '44'],
      others: ['One Size'],
    };

    console.log('📦 Generating 100 products...');

    for (let i = 0; i < 100; i++) {
      const category =
        savedCategories[Math.floor(Math.random() * savedCategories.length)];
      const catSlug = (category.slug || 'tops') as keyof typeof productNames;
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const baseName =
        productNames[catSlug][
          Math.floor(Math.random() * productNames[catSlug].length)
        ];
      const name = `${adj} ${baseName} ${i + 1}`;

      const price = Math.floor(Math.random() * 8 + 1) * 100000 + 49000; // 149k - 849k
      const discount_price = Math.random() > 0.6 ? price - 50000 : null;

      // Use different placeholder API for actual fashion images
      // Using loremflickr with fashion tag and unique lock
      const images = [
        `https://loremflickr.com/800/1200/fashion,clothing?lock=${i * 3 + 1}`,
        `https://loremflickr.com/800/1200/fashion,clothing?lock=${i * 3 + 2}`,
      ];

      const product = productRepo.create({
        name,
        description: `This ${name} is a high-quality product from our ${category.name} collection. Designed for comfort and style, it's a perfect addition to your wardrobe.`,
        price,
        discount_price,
        category: category.name,
        images,
        rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 - 5.0
        review_count: Math.floor(Math.random() * 200),
        stock: Math.floor(Math.random() * 50 + 10),
        is_featured: Math.random() > 0.8,
        has_ai_try_on: ['tops', 'bottoms', 'dresses', 'outerwear'].includes(
          catSlug,
        ),
      });

      const savedProduct = (await productRepo.save(product)) as Product;

      // Variants
      const productSizes =
        catSlug === 'footwear'
          ? sizes.shoes
          : catSlug === 'bottoms'
            ? sizes.pants
            : catSlug === 'accessories'
              ? sizes.others
              : sizes.clothes;
      const productColors = colors.slice(0, Math.floor(Math.random() * 3 + 1));

      for (const color of productColors) {
        for (const size of productSizes) {
          if (Math.random() > 0.3) {
            // Randomly skip some variants to be more realistic
            const variant = variantRepo.create({
              size,
              color,
              stock: Math.floor(Math.random() * 15),
              additional_price: null,
              product: savedProduct,
            });
            await variantRepo.save(variant);
          }
        }
      }
    }
    console.log(`✅ 100 products seeded`);

  // Demo user
  const userRepo = dataSource.getRepository(User);
  const password_hash = await bcrypt.hash('password123', 10);
  let demoUser = await userRepo.save(
    userRepo.create({
      email: 'demo@stylo.id',
      name: 'Demo User',
      password_hash,
      phone: '081234567890',
      avatar_url: 'https://picsum.photos/seed/avatar1/200/200',
      style_preferences: [prefs[0], prefs[2]],
    }),
  );

  // Add a sample shipping address for demo user
  const addrRepo = dataSource.getRepository(ShippingAddress);
  await addrRepo.save(
    addrRepo.create({
      user: demoUser,
      receiver_name: 'Demo User',
      phone: '081234567890',
      street: 'Jl. Sudirman No. 1',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postal_code: '10220',
      is_default: true,
      label: 'Home',
    }),
  );
  console.log(
    '✅ Demo user seeded (email: demo@stylo.id, password: password123)',
  );

  // Create additional test users
  const testUsers = [
      {
        email: 'alice@stylo.id',
        name: 'Alice Johnson',
        phone: '081234567891',
        prefs: [prefs[1], prefs[3]],
      },
      {
        email: 'bob@stylo.id',
        name: 'Bob Smith',
        phone: '081234567892',
        prefs: [prefs[5], prefs[0]],
      },
      {
        email: 'carol@stylo.id',
        name: 'Carol Williams',
        phone: '081234567893',
        prefs: [prefs[4], prefs[6]],
      },
      {
        email: 'david@stylo.id',
        name: 'David Brown',
        phone: '081234567894',
        prefs: [prefs[2], prefs[7]],
      },
    ];

  for (const userData of testUsers) {
    const password_hash = await bcrypt.hash('password123', 10);
    await userRepo.save(
      userRepo.create({
        ...userData,
        password_hash,
        style_preferences: userData.prefs,
      }),
    );
  }
  console.log('✅ Test users seeded');

  // Sample Reviews
  const reviewRepo = dataSource.getRepository(Review);
  const products = await productRepo.find();
  const users = await userRepo.find();

  const reviewData = [
      {
        productIndex: 0,
        user: users[0],
        rating: 5,
        comment: 'Perfect fit and great quality! Highly recommend.',
      },
      {
        productIndex: 0,
        user: users[1],
        rating: 4,
        comment: 'Nice shirt, but runs a bit large.',
      },
      {
        productIndex: 1,
        user: users[2],
        rating: 5,
        comment: 'Love this hoodie! So comfortable and warm.',
      },
      {
        productIndex: 2,
        user: users[3],
        rating: 4,
        comment: 'Classic design, good for office wear.',
      },
      {
        productIndex: 3,
        user: users[0],
        rating: 5,
        comment: 'Best jeans I have ever owned!',
      },
      {
        productIndex: 5,
        user: users[1],
        rating: 5,
        comment: 'Beautiful dress, perfect for summer!',
      },
      {
        productIndex: 6,
        user: users[2],
        rating: 5,
        comment: 'The perfect little black dress. Fits like a glove!',
      },
      {
        productIndex: 8,
        user: users[3],
        rating: 5,
        comment: 'Amazing quality leather jacket. Looks expensive!',
      },
      {
        productIndex: 10,
        user: users[0],
        rating: 4,
        comment: 'Comfortable sneakers, true to size.',
      },
      {
        productIndex: 12,
        user: users[1],
        rating: 5,
        comment: 'Elegant watch, great value for money.',
      },
    ];

  for (const review of reviewData) {
    const product = products[review.productIndex];
    const user = review.user;
    if (product && user) {
      await reviewRepo.save(
        reviewRepo.create({
          product,
          user_id: user.id,
          user_name: user.name,
          user_avatar: user.avatar_url,
          rating: review.rating,
          comment: review.comment,
        }),
      );
    }
  }
  console.log('✅ Reviews seeded');

  // Sample Notifications
  const notifRepo = dataSource.getRepository(Notification);
  await notifRepo.save([
    notifRepo.create({
        user: demoUser,
        title: 'Welcome to Stylo!',
        body: 'Thanks for joining! Explore our latest collection and enjoy 10% off your first order.',
        type: 'promotion',
        is_read: false,
      }),
      notifRepo.create({
        user: demoUser,
        title: 'New Arrivals',
        body: 'Check out the latest summer collection. Fresh styles added daily!',
        type: 'new_arrival',
        is_read: false,
      }),
      notifRepo.create({
        user: demoUser,
        title: 'Flash Sale Alert!',
        body: "24-hour flash sale on selected items. Don't miss out!",
        type: 'promotion',
        is_read: true,
      }),
    ]);
  console.log('✅ Notifications seeded');

  await dataSource.destroy();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
