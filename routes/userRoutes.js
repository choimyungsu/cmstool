// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.getUsers);
router.post('/register', userController.registerUser);
router.get('/userSearch', userController.searchUsers); //검색
router.get('/user/search/:name', userController.search); //검색

module.exports = router;