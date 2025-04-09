const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const cloudinary = require("../config/cloudinary"); // Asegúrate de que la configuración de Cloudinary esté correcta

module.exports = {
  saveProduct: async (req, res) => {
   
    try {
        const { name, description, price, title, priceBuy, sizeBralette, sizePanty, color, amountMl, category, categoryName } = req.body;
        console.log("Request body:", req.body);
        console.log("Archivos recibidos:", req.files);
        
        function isEmpty(value) {
          return (
              value === undefined ||
              value === null ||
              (typeof value === 'string' && value.trim() === '') ||
              (Array.isArray(value) && value.length === 0)
          );
      }
      
      if (
          isEmpty(name) || isEmpty(description) || isEmpty(price) || isEmpty(title) || isEmpty(priceBuy) ||
          isEmpty(sizeBralette) || isEmpty(sizePanty) || isEmpty(color) ||
          isEmpty(amountMl) || isEmpty(category) || isEmpty(categoryName)
      ) {
          return res.status(400).json({ message: "Todos los campos deben estar completos y no vacíos." });
      }
      
        // Verifica si hay archivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No se enviaron imágenes" });
        }

        // // Subir cada imagen a Cloudinary y almacenar las URLs resultantes
        const imageUploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: `DESIDERIUM/${categoryName}` },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                ).end(file.buffer);
            });
        });

        // // Espera a que todas las imágenes se suban a Cloudinary
        const imageUrls = await Promise.all(imageUploadPromises);
        console.log("URLs de imágenes:", imageUrls);

        // // Verificar si el producto ya existe
        const existingProduct = await ProductModel.findOne({ name: name.toLowerCase() });
        if (existingProduct) {
            return res.status(400).json({ message: "El producto ya existe" });
        }

        // // Crear una nueva instancia del modelo de Producto
        const newProduct = new ProductModel({
            imagePath: imageUrls, // Usa las URLs obtenidas de Cloudinary
            name: name.toLowerCase(),
            description,
            price,
            title,
            priceBuy,
            sizeBralette,
            sizePanty,
            color,
            amountMl,
            category,
            categoryName,
        });

        // // Guardar el producto en la base de datos
        const savedProduct = await newProduct.save();

        // Responder con el producto guardado
        return res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        // Manejo de errores
        return res.status(500).json({ message: "Error en el servidor", error });
    }
},

  // Leer (Obtener todos los productos)
  getProducts: async (req, res) => {
    try {
      const products = await ProductModel.find().populate('category');
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor', error });
    }
  },

  // Leer (Obtener un producto por ID)
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id).populate('category');
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor', error });
    }
  },

  // Actualizar producto
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, imagePath, description, price, title, priceBuy, sizeBralette, sizePanty, color, amountMl, category } = req.body;

      // Validación básica
      if (!name || !description || !price || !title || !priceBuy || !sizeBralette || !sizePanty || !color || !amountMl || !category) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      // Verificar si la categoría existe
      const categoryExists = await CategoryModel.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Categoría no válida' });
      }

      // Actualizar el producto
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
        name,
        imagePath,
        description,
        price,
        title,
        priceBuy,
        sizeBralette,
        sizePanty,
        color,
        amountMl,
        category
      }, { new: true });

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      return res.status(200).json(updatedProduct);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor', error });
    }
  },

  // Eliminar producto
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      return res.status(200).json({ message: 'Producto eliminado', product: deletedProduct });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor', error });
    }
  }
};
