const express = require("express");
const carritoSchema = require("../models/carrito");

const router = express.Router();

// create carrito

router.post("/carrito", (req, res) => {
  const carrito = carritoSchema(req.body);
  carrito
    .save().populate('Producto')
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get all carrito
router.get("/carritos", (req, res) => {
    carritoSchema
    .find().populate('Carrito','User')
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get carrito id
router.get("/carrito/:id", (req, res) => {
  const { id } = req.params;
  carritoSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// delete a carrito
router.delete("/carrito/:id", (req, res) => {
  const { id } = req.params;
  carritoSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// update a carrito
router.put("/carrito/:id", (req, res) => {
  const { id } = req.params;
  const {producto,user} = req.body;
  carritoSchema
    .updateOne({ _id: id }, { $set: { producto, user} })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
