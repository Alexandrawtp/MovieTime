const checkLoggedInUser = require('./middlewares')

const router = require("express").Router();

/* Home page */
router.get('/', (req, res) => {
  res.render('index');
});


/* Home page (connected) */

router.get(('/home'), checkLoggedInUser, ((req, res) => {
  let username = req.session.userData.username;
  res.render('home.hbs', {
    username
  })
}));

module.exports = router;