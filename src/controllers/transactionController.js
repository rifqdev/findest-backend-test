const { Transaction, Cart, Product } = require('../models');

const checkoutTransaction = async (req, res) => {
  const transaction = await Transaction.sequelize.transaction();

  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Cart is empty'
      });
    }

    for (const item of cartItems) {
      if (item.Product.stock < item.quantity) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Insufficient stock for product: ${item.Product.name}`
        });
      }
    }

    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.quantity * parseFloat(item.Product.price));
    }, 0);

    const transactionItems = cartItems.map(item => ({
      productId: item.productId,
      name: item.Product.name,
      price: parseFloat(item.Product.price),
      quantity: item.quantity,
      subtotal: (item.quantity * parseFloat(item.Product.price)).toFixed(2)
    }));

    const newTransaction = await Transaction.create({
      userId,
      totalAmount: totalAmount.toFixed(2),
      status: 'completed',
      items: transactionItems
    }, { transaction });

    for (const item of cartItems) {
      await Product.update(
        { stock: item.Product.stock - item.quantity },
        { where: { id: item.productId }, transaction }
      );
    }

    await Cart.destroy({
      where: { userId },
      transaction
    });

    await transaction.commit();

    res.status(201).json({
      message: 'Transaction completed successfully',
      data: newTransaction
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: { id, userId }
    });

    if (!transaction) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Transaction not found'
      });
    }

    res.json({
      message: 'Transaction retrieved successfully',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

module.exports = { checkoutTransaction, getTransactionById };