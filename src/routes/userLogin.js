const express = require("express");
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser} = require("../controllers/userControllerLogin");
const verifyToken = require("../middleware/validateToken");

const router = express.Router();
router.post('/user', registerUser);
router.get('/user', verifyToken,  getAllUsers);
router.delete('/user/:id', verifyToken, deleteUser);
router.put('/user/:id',verifyToken, updateUser);
router.post('/login', loginUser);


module.exports = router;
