const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js');
const imdb = require('imdb-api');
const axios = require('axios');
const cli = new imdb.Client({
  apiKey: '6170a01b'
});
require('./randomLists');

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
  UserModel.create({
      username,
      email,
      password: hash
    })
    .then(() => {
      res.redirect('/home');
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

  UserModel.findOne({
      username: username
    })
    .then(function (result) {
      if (result) {
        bcrypt.compare(password, result.password)
          .then((isMatching) => {
            if (isMatching) {
              req.session.userData = result
              req.session.work = false
              res.redirect('/home')
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

/* Middleware */

const checkLoggedInUser = (req, res, next) => {
  if (req.session.userData) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* Home page (profile) */

router.get(('/home'), checkLoggedInUser, ((req, res) => {
  let username = req.session.userData.username;
  res.render('home.hbs', {
    username
  })
}));

/* Profile */
router.get('/profile', checkLoggedInUser, (req, res) => {
  res.render('profile.hbs');
});

/* My list */

router.get('/my-list', checkLoggedInUser, (req, res) => {
  res.render('my-list.hbs');
});

/* Groups */

router.get('/groups', checkLoggedInUser, (req, res) => {
  res.render('groups.hbs');
});

let typeIDs = {
  'comedy': 35,
  'action': 28,
  'romantic': 10749,
  'sci-fi': 878,
  'the-best': 1234,
}

router.get('/random/:id', checkLoggedInUser, (req, res, next) => {
  const type = req.params.id;
  let api_key = process.env.API_KEY;
  axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${typeIDs[type]}`)
    .then(result => {
      movies = displayRandomFilms(result)
      res.render('random.hbs', {
        movies
      });
    })
    .catch(err => console.log(err))
});

function displayRandomFilms(result) {
  let data = result.data.results
  let randomMovies = [];
  for (let i = 0; i < 4; i++) {
    randomMovies.push(
      data[Math.floor(Math.random() * data.length)]
    )
  }
  return randomMovies;
}


/* Results */
router.get('/results', checkLoggedInUser, (req, res) => {
  res.render('results.hbs')
});

router.post('/results', checkLoggedInUser, (req, res) => {
  const {
    movieName
  } = req.body;

  cli.get({
      'name': movieName
    })
    .then(results => res.render('results.hbs', {
      results
    }))
    .catch(err => console.log(err))
});

/* Log out */

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
module.exports = checkLoggedInUser;