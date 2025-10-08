const { Product } = require('../models');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'description', 'price', 'stock', 'category', 'createdAt', 'updatedAt']
    });

    res.json({
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      attributes: ['id', 'name', 'description', 'price', 'stock', 'category', 'createdAt', 'updatedAt']
    });

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

module.exports = { getAllProducts, getProductById };