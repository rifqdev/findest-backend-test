const { User, Product } = require('../models');
const bcrypt = require('bcryptjs');

const seedInitialData = async () => {
  try {
    // Check if data already exists
    const existingUser = await User.findOne({ where: { username: 'testuser' } });

    if (!existingUser) {
      console.log('Creating initial users...');

      const hashedPassword1 = await bcrypt.hash('password123', 10);
      const hashedPassword2 = await bcrypt.hash('password123', 10);

      await User.bulkCreate([
        {
          username: 'testuser',
          email: 'testuser@example.com',
          password: hashedPassword1
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: hashedPassword2
        }
      ]);
    }

    const existingProducts = await Product.count();
    if (existingProducts === 0) {
      console.log('Creating initial products...');

      await Product.bulkCreate([
        {
          name: 'Beras',
          description: 'Beras kualitas premium 5kg',
          price: 75000.00,
          stock: 100,
          category: 'Bahan Pokok'
        },
        {
          name: 'Minyak Goreng',
          description: 'Minyak goreng kemasan 2L',
          price: 30000.00,
          stock: 50,
          category: 'Bahan Pokok'
        },
        {
          name: 'Gula Pasir',
          description: 'Gula pasir kemasan 1kg',
          price: 15000.00,
          stock: 80,
          category: 'Bahan Pokok'
        },
        {
          name: 'Telur',
          description: 'Telur ayam segar 1kg',
          price: 25000.00,
          stock: 60,
          category: 'Protein'
        },
        {
          name: 'Tepung Terigu',
          description: 'Tepung terigu kualitas baik 1kg',
          price: 12000.00,
          stock: 40,
          category: 'Bahan Pokok'
        },
        {
          name: 'Mie Instant',
          description: 'Mie instant kemasan dus (40pcs)',
          price: 60000.00,
          stock: 30,
          category: 'Makanan Instan'
        },
        {
          name: 'Kecap Manis',
          description: 'Kecap manis botol 600ml',
          price: 18000.00,
          stock: 45,
          category: 'Bumbu Dapur'
        },
        {
          name: 'Garam',
          description: 'Garam dapur kemasan 500g',
          price: 8000.00,
          stock: 70,
          category: 'Bumbu Dapur'
        }
      ]);
    }

    console.log('✅ Initial data seeding completed');
  } catch (error) {
    console.error('❌ Error seeding initial data:', error);
    throw error;
  }
};

module.exports = { seedInitialData };