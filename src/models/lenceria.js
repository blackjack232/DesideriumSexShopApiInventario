const mongoose = require("mongoose");

const lenceriaSchema = mongoose.Schema({
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

module.exports = mongoose.model('Lenceria',lenceriaSchema);