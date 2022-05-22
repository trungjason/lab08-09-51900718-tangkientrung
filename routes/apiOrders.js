const express = require('express');
const router = express.Router();
const { validatorOrder, getAllOrders, getOrderDetail, addNewOrder, updateOrder, deleteOrder } = require("../controllers/OrdersController");
const {verifyAccessTokenMiddleware} = require('../helpers/jwt');

router.get('/', getAllOrders);
router.get('/:id', getOrderDetail);

router.post('/', verifyAccessTokenMiddleware, validatorOrder, addNewOrder);
router.put('/:id', verifyAccessTokenMiddleware, validatorOrder, updateOrder);
router.delete('/:id',verifyAccessTokenMiddleware, deleteOrder);

module.exports = router;