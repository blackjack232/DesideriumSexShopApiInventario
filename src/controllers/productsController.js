const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const cloudinary = require("../config/cloudinary"); // Asegúrate de que la configuración de Cloudinary esté correcta
const { createApiResponse } = require('../utils/ApiResponse');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../constants/constants');

module.exports = {
  saveProduct: async (req, res) => {

    try {
      const { name, description, price, title, priceBuy, sizeBralette, sizePanty, color, amountMl, category, categoryName } = req.body;
      // Verifica si hay archivos
      if (!req.files || req.files.length === 0) {
        return res.status(400).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.NO_SE_ENVIARON_IMAGENES
        ));
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
        return res.status(400).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.EL_PRODUCTO_YA_EXISTE
        ));
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
      return res.status(201).json(createApiResponse(
        savedProduct,
        true,
        SUCCESS_MESSAGES.PRODUCTO_GUARDADO_EXITOSAMENTE
      ));
    } catch (error) {
      console.error(error);
      // Manejo de errores
      return res.status(500).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.ERROR_EN_EL_SERVIDOR
      ));
    }
  },

  // Leer (Obtener todos los productos)
  getProducts: async (req, res) => {
    try {
      const products = await ProductModel.find().populate('category');
      return res.status(200).json(createApiResponse(
        products,
        true,
        SUCCESS_MESSAGES.PRODUCTOS_RECUPERADOS_EXITOSAMENTE
      ));
    } catch (error) {
      console.error(error);
      return res.status(500).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.ERROR_EN_EL_SERVIDOR
      ));
    }
  },

  // Leer (Obtener un producto por ID)
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id).populate('category');
      if (!product) {
        return res.status(404).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.PRODUCTO_NO_ENCONTRADO
        ));
      }
      return res.status(200).json(createApiResponse(
        product,
        true,
        SUCCESS_MESSAGES.PRODUCTOS_RECUPERADOS_EXITOSAMENTE
      ));
    } catch (error) {
      console.error(error);
      return res.status(500).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.ERROR_EN_EL_SERVIDOR
      ));
    }
  },

  // Actualizar producto
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, imagePath, description, price, title, priceBuy, sizeBralette, sizePanty, color, amountMl, category } = req.body;

      // Validación básica
      if (!name || !description || !price || !title || !priceBuy || !sizeBralette || !sizePanty || !color || !amountMl || !category) {
        return res.status(400).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.TODOS_LOS_CAMPOS_SON_REQUERIDOS
        ));
      }

      // Verificar si la categoría existe
      const categoryExists = await CategoryModel.findById(category);
      if (!categoryExists) {
        return res.status(400).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.CATEGORIA_NO_VALIDA
        ));
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
        return res.status(404).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.PRODUCTO_NO_ENCONTRADO
        ));
      }

      return res.status(200).json(updatedProduct);

    } catch (error) {
      console.error(error);
      return res.status(500).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.ERROR_EN_EL_SERVIDOR
      ));
    }
  },

  // Eliminar producto
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.PRODUCTO_NO_ENCONTRADO
        ));
      }

      return res.status(200).json(createApiResponse(
        deletedProduct,
        true,
        SUCCESS_MESSAGES.PORDUCTO_ELIMINADO_EXITOSAMENTE

      ));

    } catch (error) {
      console.error(error);
      return res.status(500).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.ERROR_EN_EL_SERVIDOR
      ));
    }
  }
};
