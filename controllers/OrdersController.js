const Order = require('../models/Order');
const Product = require('../models/Product');
const { check, validationResult } = require("express-validator");

const validatorOrder = [
    check("total_price")
        .exists()
        .withMessage("Please enter order's total price before submit !")
        .notEmpty()
        .withMessage("Order's total price can't be empty !")
        .isFloat({ min: 0 })
        .withMessage("Order's total price must be greater than 0 !")
];

async function getAllOrders(req, res, next) {
    try {
        const orderList = await Order.find({}).lean().exec();

        return res.status(200).json({
            status: true,
            status_code: 200,
            message: "Get order list successfully !",
            data: orderList,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            status_code: 404,
            message: error.message,
        });
    }
}

async function getOrderDetail(req, res, next) {
    try {
        const _id = req.params.id;

        if (!_id) {
            return res.status(404).json({
                status: false,
                status_code: 404,
                message: "Missing Product ID Can't Get Detail Information !!!",
            });
        }

        const detailOrder = await Order.findOne({ _id: _id }).lean().exec();

        if (!detailOrder) {
            return res.status(403).json({
                status: false,
                status_code: 403,
                message: "Can't find any order with id " + _id
            });
        }

        return res.status(200).json({
            status: true,
            status_code: 200,
            message: "Get order detail successfully !",
            data: detailOrder,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            status_code: 404,
            message: error.message,
        });
    }
}

async function addNewOrder(req, res, next) {
    const validateResult = validationResult(req);

    if (validateResult.errors.length > 0) {
        return res.status(404).json({
            status: false,
            status_code: 404,
            message: validateResult.errors[0].msg,
        });
    }

    const product_list = req.body.product_list;
    let total_price = 0;

    for (let i = 0; i < product_list.length; i++) {
        const product = product_list[i];

        console.log(product);
        const detailProduct = await Product.findOne({ _id: product.product_id }).lean().exec();

        if (!detailProduct) {
            return res.status(403).json({
                status: false,
                status_code: 403,
                message: "Can't find any product with id " + product.product_id
            });
        }

        if (product.amount <= 0) {
            return res.status(403).json({
                status: false,
                status_code: 403,
                message: "Invalid product amount, it must be greather than zero !"
            });
        }

        total_price += detailProduct.price * product.amount;
    }

    if (total_price != req.body.total_price) {
        return res.status(403).json({
            status: false,
            status_code: 403,
            message: "Invalid total price please try again later"
        });
    }

    const order = new Order({
        total_price: req.body.total_price,
        product_list: req.body.product_list
    });

    order.save()
        .then((result) => {
            return res.status(201).json({
                status: true,
                status_code: 201,
                message: "Add order successfully !",
                data: result,
            });
        })
        .catch((err) => {
            return res.status(404).json({
                status: false,
                status_code: 404,
                message: err.message,
            });
        });
}

async function updateOrder(req, res, next) {
    try {
        const validateResult = validationResult(req);

        if (validateResult.errors.length > 0) {
            return res.status(404).json({
                status: false,
                status_code: 404,
                message: validateResult.errors[0].msg,
            });
        }

        const _id = req.params.id;

        if (!_id) {
            return res.status(404).json({
                status: false,
                status_code: 404,
                message: "Missing Product ID Can't Get Detail Information !!!",
            });
        }

        const product_list = req.body.product_list;
        let total_price = 0;

        for (let i = 0; i < product_list.length; i++) {
            const product = product_list[i];

            const detailProduct = await Product.findOne({ _id: product.product_id }).lean().exec();

            if (!detailProduct) {
                return res.status(403).json({
                    status: false,
                    status_code: 403,
                    message: "Can't find any product with id " + product.product_id
                });
            }

            if (product.amount <= 0) {
                return res.status(403).json({
                    status: false,
                    status_code: 403,
                    message: "Invalid product amount, it must be greather than zero !"
                });
            }

            total_price += detailProduct.price * product.amount;
        }

        if (total_price != req.body.total_price) {
            return res.status(403).json({
                status: false,
                status_code: 403,
                message: "Invalid total price please try again later"
            });
        }

        const order = {
            total_price: req.body.total_price,
            product_list: req.body.product_list
        }

        const updatedOrder = await Order.findByIdAndUpdate({ _id: _id }, order).lean().exec();

        if (!updatedOrder) {
            return res.status(403).json({
                status: false,
                status_code: 403,
                message: "Can't find any order with id " + _id
            });
        }

        return res.status(201).json({
            status: true,
            status_code: 201,
            message: "Update product successfully !",
            data: order,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            status_code: 404,
            message: error.message,
        });
    }
}

async function deleteOrder(req, res, next) {
    try {
        const _id = req.params.id;

        if (!_id) {
            return res.status(404).json({
                status: false,
                status_code: 404,
                message: "Missing Product ID Can't Get Detail Information !!!",
            });
        }

        const deleteOrder = await Order.deleteOne({ _id: _id }).lean().exec();

        return res.status(201).json({
            status: true,
            status_code: 201,
            message: "Delete order successfully !",
            data: deleteOrder,
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            status_code: 404,
            message: error.message,
        });
    }
}

module.exports = { validatorOrder, getAllOrders, getOrderDetail, addNewOrder, updateOrder, deleteOrder }