const router = require("express").Router();

/* Home page */
router.get('/', (req, res) => {
    if (req.session.userData) {
        res.render('home.hbs', {
            username: req.session.userData.username
        })
    } else {
        res.render('index');
    }
});

module.exports = router;