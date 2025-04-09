const mongoose = require("mongoose");

const carritoSchema = mongoose.Schema({
  producto:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Producto'
  }]
});

module.exports = mongoose.model('Carrito',carritoSchema);