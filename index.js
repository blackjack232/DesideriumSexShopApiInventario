// index.js
const  swaggerUI = require('swagger-ui-express');
const swaggerSpec = require("./swagger/swagger");
const express = require('express');
const mongoose = require("mongoose");

require('dotenv').config();
var cors = require('cors');
const userLogin = require('./src/routes/userLogin');
const categoryRoute = require("./src/routes/categoryRouter");
const productRoute = require("./src/routes/productRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('¡Bienvenido al api de inventario Desiderium!');
});

// Productos nuevo
app.use("/api", productRoute);
// Category
app.use("/api", categoryRoute);
// Login 
app.use("/api", userLogin);


app.use(cors({ origin: '*' }));

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
  