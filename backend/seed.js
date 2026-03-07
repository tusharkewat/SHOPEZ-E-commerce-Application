const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

// Minimal Schemas for seeding
const bannerSchema = new mongoose.Schema({ image_url: String }, { timestamps: true });
const productSchema = new mongoose.Schema({
  name: String, description: String, price: Number, discount: Number,
  category: String, gender: String, stock: Number, sizes: [String], images: [String]
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
const Product = mongoose.model('Product', productSchema);

const products = [
  {
    name: 'Premium Leather Jacket',
    description: 'High quality genuine leather jacket perfect for winter. Classic design that never goes out of style.',
    price: 4999,
    discount: 20,
    category: 'Fashion',
    gender: 'MEN',
    stock: 50,
    sizes: ['M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000']
  },
  {
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Immersive sound experience with active noise cancellation and 30-hour battery life.',
    price: 12999,
    discount: 15,
    category: 'Electronics',
    gender: 'UNISEX',
    stock: 100,
    sizes: [],
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000']
  },
  {
    name: 'Smart Fitness Watch Series 7',
    description: 'Track your health, workouts, and receive notifications directly on your wrist.',
    price: 8999,
    discount: 0,
    category: 'Electronics',
    gender: 'UNISEX',
    stock: 75,
    sizes: [],
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=1000']
  },
  {
    name: 'Designer Sunglasses',
    description: 'UV400 protection with a sleek, modern frame design.',
    price: 1599,
    discount: 30,
    category: 'Fashion',
    gender: 'WOMEN',
    stock: 200,
    sizes: [],
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1000']
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Breathable, sustainable, and incredibly soft everyday t-shirt.',
    price: 799,
    discount: 0,
    category: 'Fashion',
    gender: 'UNISEX',
    stock: 150,
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000']
  },
  {
    name: 'Professional Yoga Mat',
    description: 'Non-slip, eco-friendly material with perfect cushioning for your practice.',
    price: 1299,
    discount: 10,
    category: 'Sports Equipment',
    gender: 'UNISEX',
    stock: 80,
    sizes: [],
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=1000']
  },
  {
    name: 'Premium Coffee Beans (1kg)',
    description: 'Freshly roasted Arabica beans sourced from ethically managed farms.',
    price: 899,
    discount: 5,
    category: 'Groceries',
    gender: 'UNISEX',
    stock: 120,
    sizes: [],
    images: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=1000']
  },
  {
    name: 'Smartphone Pro Max',
    description: 'The latest flagship smartphone with incredible camera capabilities.',
    price: 89999,
    discount: 5,
    category: 'Mobiles',
    gender: 'UNISEX',
    stock: 30,
    sizes: [],
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000']
  }
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoURI);

  try {
    // 1. Seed Banner
    console.log('Seeding banner...');
    await Banner.deleteMany({});
    await Banner.create({ image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070' });
    console.log('✅ Banner seeded');

    // 2. Seed Products
    console.log('Seeding products...');
    const count = await Product.countDocuments();
    
    if (count > 0) {
      console.log('Products collection is not empty. Skipping product seed to avoid duplicates.');
    } else {
      await Product.insertMany(products);
      console.log(`✅ ${products.length} products seeded`);
    }

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
