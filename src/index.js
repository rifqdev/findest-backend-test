require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const sequelize = require('./config/database');
const { seedInitialData } = require('./config/databaseInit');
const errorHandler = require('./utils/errorHandler');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const transactionRoutes = require('./routes/transactions');

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sembako E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for sembako e-commerce application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Sembako E-Commerce API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

app.use(errorHandler);

const initializeApp = async () => {
  try {
    // 1. Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // 2. Auto-sync tables for development (safer than migrations for quick setup)
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');

    // 3. Seed initial data if needed
    await seedInitialData();

    console.log('🚀 Application ready to start!');
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1); // Exit if database setup fails
  }
};

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initializeApp();

  app.listen(PORT, () => {
    console.log(`🌐 Server is running on port ${PORT}`);
    console.log(`📚 API documentation available at: http://localhost:${PORT}/api-docs`);
    console.log(`🏠 Homepage: http://localhost:${PORT}`);
  });
};

startServer();