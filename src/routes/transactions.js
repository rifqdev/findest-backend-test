const express = require('express');
const authMiddleware = require('../middleware/auth');
const { checkoutTransaction, getTransactionById } = require('../controllers/transactionController');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/transactions/checkout:
 *   post:
 *     summary: Checkout transaction (authenticated user)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Transaction completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     totalAmount:
 *                       type: string
 *                     status:
 *                       type: string
 *                     items:
 *                       type: array
 *       400:
 *         description: Validation error or empty cart
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', checkoutTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID (authenticated user, only own transactions)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     totalAmount:
 *                       type: string
 *                     status:
 *                       type: string
 *                     items:
 *                       type: array
 *                     createdAt:
 *                       type: string
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', getTransactionById);

module.exports = router;