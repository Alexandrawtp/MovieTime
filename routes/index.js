const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* Sign Up page */
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up.hbs')
});

router.post('/sign-up', (req, res, next) => {
  const {
    username,
    email,
    password
  } = req.body;

  if (!username.length || !email.length || !password.length) {
    res.render('/sign-up', {
      msg: 'Please enter all fields'
    })
    return;
  }
  let re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    res.render('/sign-up', {
      msg: 'Email not in valid format'
    })
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  UserModel.create({
      username,
      email,
      password: hash
    })
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      next(err)
    })
});

/* Login page */
router.get('/login', (req, res) => {
  res.render('login.hbs')
});

router.post('/login', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  console.log(username);
  console.log(req.body);
  UserModel.findOne({
      username: username
    })
    .then((result) => {
      console.log('result:', result);
      if (result) {
        bcrypt.compare(password, result.password)
          .then((isMatching) => {
            if (isMatching) {
              req.session.loggedInUser = result
              res.redirect('/profile')
            } else {
              res.render('login.hbs', {
                msg: 'Passwords don\'t match'
              })
            }
          })
      } else {
        res.render('login.hbs', {
          msg: 'Username does not exist'
        })
      }
    })
    .catch((err) => {
      next(err)
    })
});

/* Profile page */
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