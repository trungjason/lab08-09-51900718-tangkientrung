const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.userLogin) {
        res.redirect("/");
    }

    res.render('login', { title: 'Login', csrfToken: req.csrfToken() });
});

module.exports = router;