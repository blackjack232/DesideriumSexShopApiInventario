const CategoryModel = require("../models/categoryModel");
const { createApiResponse } = require ('../utils/ApiResponse.js');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/constants'); 


module.exports = {
  saveCategory: async (req, res) => {
    try {
      const { name, description , state} = req.body;

      // Validación básica para asegurar que se han enviado los datos necesarios
      if (!name || !description) {
        return res.status(400).json(createApiResponse(
          null, 
          false, 
          ERROR_MESSAGES.VALIDATION_ERROR
        ));
      }

      // Convertir el nombre a minúsculas
      const nameLower = name.toLowerCase();

      // Verificar si la categoría ya existe
      const existingCategory = await CategoryModel.findOne({ name: nameLower });

      if (existingCategory) {
        return res.status(400).json(createApiResponse(
          null, 
          false, 
          ERROR_MESSAGES.CATEGORY_EXISTS
        ));
      }

      // Crear una nueva instancia del modelo de Categoría
      const newCategory = new CategoryModel({
        name: nameLower, // Guardar en minúsculas
        description,
        state 
      });

      // Guardar la categoría en la base de datos
      const savedCategory = await newCategory.save();

      // Responder con la categoría guardada
      return res.status(201).json(createApiResponse(
        savedCategory,
        true,
        SUCCESS_MESSAGES.CATEGORY_SAVED
      ));

    } catch (error) {
      console.error(error);

      // Manejo de errores
      return res.status(500).json(createApiResponse(
        null, 
        false, 
        ERROR_MESSAGES.SERVER_ERROR
      ));
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const categories = await CategoryModel.find();

      // Usa el helper para crear la respuesta
      const respuesta = createApiResponse(categories, true, SUCCESS_MESSAGES.OPERATION_SUCCESS);

      return res.status(200).json(respuesta);
    } catch (error) {
      console.error(error); 
      // Respuesta de error para el cliente
      const respuestaError = createApiResponse(
        null, 
        false, 
        ERROR_MESSAGES.SERVER_ERROR
      );

      return res.status(500).json(respuestaError);
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json(createApiResponse(
          null, 
          false, 
          ERROR_MESSAGES.VALIDATION_ERROR
        ));
      }

      const category = await CategoryModel.findById(id);

      if (!category) {
        return res.status(404).json(createApiResponse(
          null, 
          false, 
          ERROR_MESSAGES.NOT_FOUND
        ));
      }

      return res.status(200).json(createApiResponse(
        category,
        true,
        SUCCESS_MESSAGES.CATEGORY_FOUND
      ));
    } catch (error) {
      console.error(error);

      return res.status(500).json(createApiResponse(
        null, 
        false, 
        ERROR_MESSAGES.SERVER_ERROR
      ));
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, state } = req.body;

      if (!id) {
        return res.status(400).json(createApiResponse(
          null, 
          false, 
          ERROR_MESSAGES.VALIDATION_ERROR
        ));
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id,
        { name, description , state},
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        return res.status(404).json(createApiResponse(
          null, 
          false, 
          ERROR_MESSAGES.NOT_FOUND
        ));
      }

      return res.status(200).json(createApiResponse(
        updatedCategory,
        true,
        SUCCESS_MESSAGES.CATEGORY_UPDATED
      ));
    } catch (error) {
      console.error(error);
      return res.status(500).json(createApiResponse(
        null, 
        false, 
        ERROR_MESSAGES.SERVER_ERROR
      ));
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json(createApiResponse(
          null, 
          false, 
          ERROR_MESSAGES.VALIDATION_ERROR
        ));
      }

      const deletedCategory = await CategoryModel.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res.status(404).json(createApiResponse(
          null, 
          false, 
          ERROR_MESSAGES.NOT_FOUND
        ));
      }

      return res.status(200).json(createApiResponse(
        null,
        true,
        SUCCESS_MESSAGES.CATEGORY_DELETED
      ));
    } catch (error) {
      console.error(error);
      return res.status(500).json(createApiResponse(
        null, 
        false, 
        ERROR_MESSAGES.SERVER_ERROR
      ));
    }
  },
  deleteCategoriesBulk: async (req, res) => {
    try {
      const { ids } = req.body;
console.log(ids);
      // Validación: verificar si se proporcionó la lista de IDs
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.VALIDATION_ERROR
        ));
      }

      // Eliminar las categorías cuyos IDs estén en la lista
      const result = await CategoryModel.deleteMany({
        _id: { $in: ids }
      });

      if (result.deletedCount === 0) {
        return res.status(404).json(createApiResponse(
          null,
          false,
          ERROR_MESSAGES.NOT_FOUND
        ));
      }

      return res.status(200).json(createApiResponse(
        { deletedCount: result.deletedCount },
        true,
        SUCCESS_MESSAGES.CATEGORIES_DELETED
      ));
    } catch (error) {
      console.error(error);
      return res.status(500).json(createApiResponse(
        null,
        false,
        ERROR_MESSAGES.SERVER_ERROR
      ));
    }
  }
}
