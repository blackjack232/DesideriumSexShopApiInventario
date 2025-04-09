const express = require("express");
const { getProducts , createProduct,getCategoryProduct } = require("../controllers/productController");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
router.get('/product/:categoria', getProducts);
// Crear producto
router.post('/createProduct', upload.array('imagePath', 10), createProduct);

router.get('/getCategoryProduct', getCategoryProduct);
module.exports = router;
