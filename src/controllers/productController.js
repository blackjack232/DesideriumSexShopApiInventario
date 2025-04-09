const productosSchema = require("../models/productsModel");
const ProductosModel = require("../models/productsModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  getProducts: async (req, res) => {
    try {
      const { categoria } = req.params;

      //   // Verifica si la categoría existe en el modelo
      //   const categoriasExistentes = Object.keys(ProductosModel.schema.paths);
      //   if (!categoriasExistentes.includes(categoria)) {
      //     return res.status(404).json({ error: "Categoría no encontrada" });
      //   }

      // Recupera los productos de la categoría específica
      const productos = await productosSchema.find({
        [`${categoria}`]: { $exists: true },
      });
      console.log("cate", productos);

      if (productos.length > 0) {
        return res.json(productos.map((producto) => producto[categoria]));
      } else {
        return res
          .status(404)
          .json({ error: "No hay productos en la categoría especificada" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  createProduct: async (req, res) => {
    console.log("entro",req)
    try {
      const {
        name,
        description,
        cantidadTotal,
        precio,
        precioC,
        canidadML,
        title,
        categoria,
      } = req.body;
       debugger
      // Verifica si la categoría existe en el modelo
      const categoriasExistentes = ["Dildo", "Vibrador", "Lenceria"];
      if (!categoriasExistentes.includes(categoria)) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }

      // Verifica que se proporcionen archivos de imagen
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ error: "No se proporcionaron archivos de imagen." });
      }

      // Subir cada imagen a Cloudinary y almacenar las URLs resultantes
      const imageUploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: `DESIDERIUM/${categoria}` },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result.secure_url);
                }
              }
            )
            .end(file.buffer);
        });
      });

      // Espera a que todas las imágenes se suban a Cloudinary
      const imageUrls = await Promise.all(imageUploadPromises);
      console.log("URLs de imágenes:", imageUrls);

      // Define el objeto del producto con las URLs de imágenes
      const nuevoProducto = {
        name,
        description,
        cantidadTotal,
        precio,
        precioC,
        canidadML,
        title,
        imagePath: imageUrls, // Usar un array de URLs
      };

      // Guarda el nuevo producto en la categoría correspondiente
      const resultado = await productosSchema.updateOne(
        { categoria },
        { $push: { [categoria]: nuevoProducto } },
        { upsert: true } // Crea el documento si no existe
      );

      if (resultado.nModified > 0 || resultado.upserted) {
        return res.json({ message: "Producto guardado exitosamente" });
      } else {
        return res.status(500).json({ error: "Error al guardar el producto" });
      }
    } catch (error) {
      console.error("Error interno del servidor:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  getCategoryProduct: async (req, res) => {
    try {
      // Busca un documento que contenga categorías
      const categoryDocument = await ProductosModel.findOne({}, { _id: 0 }); // Ignorar el _id
      if (categoryDocument) {
        // Extrae los nombres de las categorías
        const categoryNames = Object.keys(categoryDocument.toObject());
        res.json(categoryNames);
      } else {
        res.status(404).json({ message: "No categories found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
}


