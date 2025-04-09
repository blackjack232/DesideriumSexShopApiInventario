const mongoose = require("mongoose");

const listComprasSchema = mongoose.Schema({
    producto:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Producto'
      }],
});

module.exports = mongoose.model('ListaCompras',listComprasSchema);