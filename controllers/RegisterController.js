const { check, validationResult } = require("express-validator");
const User = require('../models/User');

const validatorRegister = [
    check("username")
        .exists()
        .withMessage("Please enter username before submit !")
        .notEmpty()
        .withMessage("Username can't be empty !")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username length should be between 3 and 50 characters !"),

    check("password")
        .exists()
        .withMessage("Please enter password before submit !")
        .notEmpty()
        .withMessage("Password can't be empty !")
        .isLength({ min: 6, max: 100 })
        .withMessage("Password length should be between 6 and 100 characters !"),

    check("password_confirm")
        .exists()
        .withMessage("Please enter password confirm before submit !")
        .notEmpty()
        .withMessage("Password confirm can't be empty !")
        .isLength({ min: 6, max: 100 })
        .withMessage("Password confirm length should be between 6 and 100 characters !"),

    check("email")
        .exists()
        .withMessage("Please enter user's email before submit !")
        .notEmpty()
        .withMessage("User's email can't be empty !")
        .isEmail()
        .withMessage("Invalid user's email format !"),
];

async function registerAccount(req, res, next) {
    if (req.session.userLogin) {
        return res.status(406).json({
            status: false,
            status_code: 406,
            message: "You need to logout first !!!",
        });
    }

    const validateResult = validationResult(req);

    if (validateResult.errors.length > 0) {
        return res.status(404).json({
            status: false,
            status_code: 404,
            message: validateResult.errors[0].msg,
        });
    }

    User.findOne({
        $or: [
            { username: req.body.username }, { email: req.body.email }
        ]
    }, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: false,
                status_code: 404,
                message: err.message,
            });
        }

        if (user) {
            if (user.username === req.body.username) {
                return res.status(404).json({
                    status: false,
                    status_code: 404,
                    message: "Duplicate username , please choose a different username  !!!",
                });
            }

            if (user.email === req.body.email) {
                return res.status(404).json({
                    status: false,
                    status_code: 404,
                    message: "Duplicate email , please choose a different email  !!!",
                });
            }
        }

        const newUser = new User({ username: req.body.username, email: req.body.email, password: req.body.password });
        newUser.save().then((result) => {

            return res.status(201).json({
                status: true,
                status_code: 201,
                message: "Register account successfully !!!",
                data: result,
            });
        })
            .catch((err) => {
                return res.status(401).json({
                    status: false,
                    status_code: 401,
                    message: "Register account failed !!!",
                });
            });
    });
};

module.exports = { validatorRegister, registerAccount }