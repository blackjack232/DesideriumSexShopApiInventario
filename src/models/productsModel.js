const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema de productos
const productoSchema = new Schema({
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
  precio: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  precioC: {
    type: String,
    required: true
  },
  tallaBralette:{
    type:Array,
    required:true
  },
  tallaPanty:{
    type:Array,
    required:true
  },
  color:{
    type:Array,
    required:true
  },
  cantidadTotal: {
    type: Number,
    required:true
  },
});

const subcategoriaSchema = new Schema({
  nombre: String,
  productos: [productoSchema],
});

const categoriaSchema = new Schema({
  nombre: String,
  subcategorias: [subcategoriaSchema],
});

const productosSchema = new Schema({
  lenceria: [categoriaSchema],
  pijama: [categoriaSchema],
  lubricante: [categoriaSchema],
  dildo: [categoriaSchema],
  vibrador: [categoriaSchema],
  masturbador: [categoriaSchema],
  plugAnal: [categoriaSchema],
  subcionadoClitoris: [categoriaSchema],
  bombaPene: [categoriaSchema],
  estimulacionAnal: [categoriaSchema],
  estimulacionProstata: [categoriaSchema],
  bolasvaginales: [categoriaSchema],
  sexMachine: [categoriaSchema],
});

const ProductosModel = mongoose.model('Productos', productosSchema);

module.exports = ProductosModel;
