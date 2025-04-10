const express = require('express');
const productController = require('../controllers/productsController');
const verifyToken = require("../middleware/validateToken");
const multer = require('multer');
const router = express.Router();

// Configuración de multer para manejar imágenes en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Endpoints para gestión de productos
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               priceBuy:
 *                 type: number
 *               sizeBralette:
 *                 type: array
 *                 items:
 *                   type: string
 *               sizePanty:
 *                 type: array
 *                 items:
 *                   type: string
 *               color:
 *                 type: array
 *                 items:
 *                   type: string
 *               amountMl:
 *                 type: number
 *               category:
 *                 type: string
 *                 description: ID de la categoría existente
 *               categoryName:
 *                   type: String  
 *               imagePath:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/products',verifyToken, upload.array('imagePath', 10), productController.saveProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/products', verifyToken , productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Detalle del producto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/products/:id',verifyToken, productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               priceBuy:
 *                 type: number
 *               sizeBralette:
 *                 type: array
 *                 items:
 *                   type: string
 *               sizePanty:
 *                 type: array
 *                 items:
 *                   type: string
 *               color:
 *                 type: array
 *                 items:
 *                   type: string
 *               amountMl:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/products/:id', verifyToken, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/products/:id', verifyToken, productController.deleteProduct);

module.exports = router;
