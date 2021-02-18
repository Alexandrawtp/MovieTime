const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js');

/* Sign Up page */
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.hbs')
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
  const user = {
      username,
      email,
      password: hash
  }
  UserModel.create(user)
      .then(() => {
          req.session.userData = user
          res.redirect('/');
      })
      .catch((err) => {
          next(err);
      })
});
/* Login page */
router.get('/login', (req, res) => {
  res.render('auth/login.hbs')
});
router.post('/login', (req, res, next) => {
  const {
      username,
      password
  } = req.body;
  UserModel.findOne({username: username})
      .then((result) => {
          if (result) {
              bcrypt.compare(password, result.password)
                  .then((isMatching) => {
                      if (isMatching) {
                          req.session.userData = result
                          res.redirect('/')
                      } else {
                          res.render('auth/login.hbs', {
                              msg: 'Password don\'t match'
                          })
                      }
                  })
                  .catch((err) => {
                      next(err)
                  })
          } else {
              res.render('auth/login.hbs', {
                  msg: 'Username does not exist'
              })
          }
      })
      .catch((err) => {
          next(err)
      })
});
/* Log out */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})
module.exports = router;