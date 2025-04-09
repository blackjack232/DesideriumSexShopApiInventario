const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema de Producto
const productSchema = new Schema({
  imagePath: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  priceBuy: {
    type: Number,
    required: true
  },
  sizeBralette: {
    type: Array,
    required: true
  },
  sizePanty: {
    type: Array,
    required: true
  },
  color: {
    type: Array,
    required: true
  },
  amountMl: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId, 
    ref: 'Category',  // Referencia al modelo de Categoría
    required: true
  }
  ,
  categoryName:{
    type: String,
    required: true
  }
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
