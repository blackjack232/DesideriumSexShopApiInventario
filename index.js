const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors')
require("dotenv").config();
const userRoute = require("./src/routes/user");
const userLogin = require('./src/routes/userLogin')
const lenceriaRoute = require("./src/routes/lenceria");
const productsRoute = require("./src/routes/productsRouter");
const categoryRoute = require("./src/routes/categoryRouter");
const productRoute = require("./src/routes/productRouter");


const validatetoken = require('./src/middleware/validateToken');
const validateRol = require('./src/middleware/validateRol');


// settings
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", lenceriaRoute);
app.use("/api", userLogin);
// Productos viejo
app.use("/api", productsRoute);
// Productos nuevo
app.use("/api", productRoute);
// Usuarios
app.use("/api/:id", userRoute);

// Category
app.use("/api", categoryRoute);


// routes
app.get("/", (req, res) => {
  res.send("Bienvenido api Desiderium");
});

app.use(cors({ origin: '*' }));

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

// server listening
app.listen(port, () => console.log("Server listening to", port));
