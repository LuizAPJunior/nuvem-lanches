// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');


router.post('/cadastrar', authController.cadastrar);
router.post('/login', loginLimiter, authController.login);
module.exports = router;