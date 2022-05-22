const express = require("express");
const router = express.Router();
const {verifyAccessTokenMiddleware} = require("../helpers/jwt");

/* GET home page. */
router.get("/", function(req, res, next) {
    console.log(req.session);
    res.render("index", { userLogin: req.session.userLogin });
});

router.get("/product-management",verifyAccessTokenMiddleware ,function(req, res, next) {
    res.render("product-management");
});

module.exports = router;