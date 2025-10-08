const { Cart, Product } = require('../models');

const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'stock']
      }]
    });

    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.quantity * parseFloat(item.Product.price));
    }, 0);

    res.json({
      message: 'Cart items retrieved successfully',
      data: {
        items: cartItems,
        totalAmount: totalAmount.toFixed(2),
        itemCount: cartItems.length
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Product ID and quantity are required, quantity must be greater than 0'
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Insufficient stock'
      });
    }

    const existingCartItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Insufficient stock for requested quantity'
        });
      }

      await existingCartItem.update({ quantity: newQuantity });

      const updatedCartItem = await Cart.findByPk(existingCartItem.id, {
        include: [{ model: Product, attributes: ['id', 'name', 'price', 'stock'] }]
      });

      return res.status(200).json({
        message: 'Cart item updated successfully',
        data: updatedCartItem
      });
    }

    const cartItem = await Cart.create({
      userId,
      productId,
      quantity
    });

    const createdCartItem = await Cart.findByPk(cartItem.id, {
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'stock'] }]
    });

    res.status(201).json({
      message: 'Item added to cart successfully',
      data: createdCartItem
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Quantity is required and must be greater than 0'
      });
    }

    const cartItem = await Cart.findOne({
      where: { id, userId },
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'stock'] }]
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Cart item not found'
      });
    }

    if (cartItem.Product.stock < quantity) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Insufficient stock'
      });
    }

    await cartItem.update({ quantity });

    res.json({
      message: 'Cart item updated successfully',
      data: cartItem
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Cart item not found'
      });
    }

    await cartItem.destroy();

    res.json({
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart
};