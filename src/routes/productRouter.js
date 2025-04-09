const productController = require('../controllers/productsController');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Crear un nuevo producto
router.post('/products', upload.array('imagePath', 10), productController.saveProduct);

// Obtener todos los productos
router.get('/products', productController.getProducts);

// Obtener un producto por ID
router.get('/products/:id', productController.getProductById);

// Actualizar un producto por ID
router.put('/products/:id', productController.updateProduct);

// Eliminar un producto por ID
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
