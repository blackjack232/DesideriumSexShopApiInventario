const express = require("express");
const lenceriaSchema = require("../models/lenceria");

const router = express.Router();

// create producto lenceria
router.post("/lenceria", (req, res) => {
  const lenceria = lenceriaSchema(req.body);
  lenceria
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get all productos lenceria
router.get("/lencerias", (req, res) => {
  lenceriaSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get producto id lenceria
router.get("/lenceria/:id", (req, res) => {
  const { id } = req.params;
  lenceriaSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// delete a producto lenceria
router.delete("/lenceria/:id", (req, res) => {
  const { id } = req.params;
  lenceria
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// update a producto lenceria
router.put("/lenceria/:id", (req, res) => {
  const { id } = req.params;
  const { imagePath,name, description, precio, title} = req.body;
  lenceriaSchema
    .updateOne({ _id: id }, { $set: { imagePath,name, description, precio, title} })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
