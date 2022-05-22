const express = require('express');
const router = express.Router();
const { validatorProduct, getAllProducts, getProductDetail, addNewProduct, updateProduct, deleteProduct } = require("../controllers/ProductsController");
const {verifyAccessTokenMiddleware} = require('../helpers/jwt');

/* GET home page. */
router.get('/', getAllProducts);
router.get('/:id', getProductDetail);

router.post('/', verifyAccessTokenMiddleware, validatorProduct, addNewProduct);
router.put('/:id', verifyAccessTokenMiddleware, validatorProduct, updateProduct);
router.delete('/:id',verifyAccessTokenMiddleware, validatorProduct, deleteProduct);

module.exports = router;