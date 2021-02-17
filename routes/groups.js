const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();

router.get('/groups', checkLoggedInUser, (req, res) => {
    res.render('groups.hbs');
});

module.exports = router;