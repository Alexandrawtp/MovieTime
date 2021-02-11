const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up.hbs')
});

router.get('/login', (req, res, next) => {
  res.render('login.hbs')
});

router.get('/profile', (req, res, next) => {
  res.render('profile.hbs')
});

router.get('/my-list', (req, res, next) => {
  res.render('my-list.hbs')
});

router.get('/groups', (req, res, next) => {
  res.render('groups.hbs')
});

module.exports = router;
