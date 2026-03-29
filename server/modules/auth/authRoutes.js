const express = require('express');
const router = express.Router();

const authController = require('./authController');
const loginLimiter = require('../../middleware/loginLimiter');
const validate = require('../../middleware/validate');
const { cadastrarSchema, loginSchema } = require('./auth.schema');

router.post('/cadastrar', validate(cadastrarSchema), authController.cadastrar);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

module.exports = router;