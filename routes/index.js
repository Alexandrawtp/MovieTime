const checkLoggedInUser = require('./middlewares')

const router = require("express").Router();

/* Home page */
router.get('/', (req, res) => {
  if (req.session.userData) {
    res.render('home.hbs', {
      userLoggedIn: true
    });
  } else {
    res.render('home.hbs', {
      userLoggedIn: false
    });
  }
  // res.render('index');
});

module.exports = router;