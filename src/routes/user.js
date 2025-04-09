const express = require("express");
const userSchema = require("../models/user");
const { createUser, getAllUsers, updateComprasUser, getUser } = require("../controllers/userController")


const router = express.Router();

// create user
router.post('/users', createUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateComprasUser);


module.exports = router;
