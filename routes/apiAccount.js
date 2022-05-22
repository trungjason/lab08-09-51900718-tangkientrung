const express = require('express');
const router = express.Router();
const { validatorRegister, registerAccount } = require('../controllers/RegisterController');
const { validatorLogin, loginValidate } = require('../controllers/LoginController');

router.post('/register', validatorRegister, registerAccount);
router.post('/login', validatorLogin, loginValidate);

module.exports = router;