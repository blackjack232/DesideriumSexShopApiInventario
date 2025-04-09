const mongoose = require("mongoose");

const listVentasSchema = mongoose.Schema({
    producto:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Producto'
      }],
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
      },
});

module.exports = mongoose.model('ListVentas',listVentasSchema);