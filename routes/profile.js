const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();

router.get('/profile', checkLoggedInUser, (req, res) => {
    res.render('profile.hbs');
});


module.exports = router;