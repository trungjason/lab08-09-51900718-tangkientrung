const { check, validationResult } = require("express-validator");
const { signAccessToken, signRefreshToken } = require("../helpers/jwt");
const User = require('../models/User');

const validatorLogin = [
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
        .withMessage("Password length should be between 6 and 100 characters !")
];

async function loginValidate(req, res, next) {
    // Validate to make sure form data that is going to be submited will have email and password field
    if (req.session.userLogin) {
        return res.status(406).json({
            status: false,
            status_code: 406,
            message: "You are already log in !!!",
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

    const user = await User.findOne({ username: req.body.username });

    if (!user) {
        return res.status(401).json({
            status: false,
            status_code: 401,
            message: "Login failed ! Username or password is wrong please try again !!!",
        });
    }

    if (user.verifyPassword(req.body.password)) {
        req.session.userLogin = true;
        req.session.user_id = user._id;

        const payload = {
            user_id: user._id,
            username: user.username,
            email: user.email,
            role : "User | Admin"
        }

        const accessToken = await signAccessToken(payload);

        const newDate = new Date();
        const expDate = newDate.setMonth(newDate.getMonth() + 3)
        res.cookie('accessToken', accessToken, { sameSite: true, maxAge: expDate });

        // Generate JWT and send back to client
        return res.status(200).json({
            status: true,
            status_code: 200,
            message: "Login successfully !!!",
            accessToken: accessToken
        });
    } else {
        return res.status(401).json({
            status: false,
            status_code: 401,
            message: "Login failed ! Username or password is wrong please try again !!!",
        });
    }
};

module.exports = { validatorLogin, loginValidate }