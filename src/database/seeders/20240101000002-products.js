'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Beras',
        description: 'Beras kualitas premium 5kg',
        price: 75000.00,
        stock: 100,
        category: 'Bahan Pokok',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Minyak Goreng',
        description: 'Minyak goreng kemasan 2L',
        price: 30000.00,
        stock: 50,
        category: 'Bahan Pokok',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gula Pasir',
        description: 'Gula pasir kemasan 1kg',
        price: 15000.00,
        stock: 80,
        category: 'Bahan Pokok',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Telur',
        description: 'Telur ayam segar 1kg',
        price: 25000.00,
        stock: 60,
        category: 'Protein',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tepung Terigu',
        description: 'Tepung terigu kualitas baik 1kg',
        price: 12000.00,
        stock: 40,
        category: 'Bahan Pokok',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mie Instant',
        description: 'Mie instant kemasan dus (40pcs)',
        price: 60000.00,
        stock: 30,
        category: 'Makanan Instan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kecap Manis',
        description: 'Kecap manis botol 600ml',
        price: 18000.00,
        stock: 45,
        category: 'Bumbu Dapur',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Garam',
        description: 'Garam dapur kemasan 500g',
        price: 8000.00,
        stock: 70,
        category: 'Bumbu Dapur',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};