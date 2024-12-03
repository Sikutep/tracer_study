const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Mengambil nilai dari file .env
const { URL, PORT, NODE_ENV } = process.env;

// Konfigurasi Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tracer Study API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk sistem Tracer Study',
    },
    // servers: [
    //   {
    //     url: 'https://tracerstudylp3i.com',
    //     description: 'Production Server',
    //   },
    //   {
    //     url: 'https://192.168.18.176:5000',
    //     description: 'Local Development Server',
    //   },
    // ],
    servers: [
      {
        url: `${URL}:${PORT}` || `https://9l47d23v-5000.asse.devtunnels.ms`, // URL server dari file .env
        description: 'Development Server',
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/Routes/*.js'], // Path ke file Routes dengan JSDoc
};

// Inisialisasi Swagger
const swaggerSpec = swaggerJSDoc(options);

// Fungsi setup Swagger
const setupSwaggerDocs = (app) => {
  if (NODE_ENV === 'development') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger docs tersedia di ${URL}:${PORT}/api-docs`);
  } else {
    console.log('Swagger hanya tersedia di lingkungan development.');
  }
};

module.exports = setupSwaggerDocs;
