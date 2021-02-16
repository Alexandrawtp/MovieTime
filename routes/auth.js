const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js');
const GroupModel = require('../models/Group.model.js')
const imdb = require('imdb-api');
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
    res.render('auth/sign-up', {
      msg: 'Please enter all fields'
    })
    return;
  }

  let re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    res.render('auth/sign-up', {
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
  let groups = req.session.userData.groups_id
  res.render('home.hbs', {username}, {groups})
  console.log(UserModel)
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
  res.render('groups1.hbs');
});

// create a group

router.post('/groups', (req, res, next) => {
  const {
    groupname,
  } = req.body;

  if (!groupname.length) {
    res.render('groups1', {
      msg: 'Please enter all fields'
    })
    return;
  }
  GroupModel.create({
      groupname,
    })
    .then(() => {
      res.redirect('/groups');
    })
    .catch((err) => {
      next(err);
    })
});

// connect to the group

function getUserWithGroup(username){
  return User.findOne({ username: username })
    .populate('groups').exec((err, groups) => {
      console.log("Populated User " + groups);
    })
}

/* Random pages */
let romanticFilms = ['The Photograph', 'Portrait of a Lady on Fire', 'A Star Is Born', 'If Beale Street Could Talk', 'If Beale Street Could Talk', 'Call Me By Your Name', 'Carol', 'Anna Karenina', 'The Vow', 'Lust, Caution', 'Brokeback Mountain', 'The Notebook', 'Eternal Sunshine of the Spotless Mind', 'Moulin Rouge', 'Monsoon Wedding', 'Y Tu Mamá También', 'Love and Basketball', 'Titanic', 'Pride and Prejudice', 'Before Sunrise', 'The Bodyguard', 'Like Water for Chocolate', 'Cinema Paradiso', 'Dirty Dancing', 'An Officer and a Gentleman', 'Mahogany', 'The Way We Were', 'Love Story', 'The Story of a Three-Day Pass', 'Doctor Zhivago', 'The Umbrellas of Cherbourg', 'Splendor in the Grass', 'An Affair to Remember', 'From Here to Eternity', 'Roman Holiday', 'Casablanca'];
let movies = [];

function fourFilms(filmlist) {
  for(let i=0; i<4; i++) {
    movies.push(filmlist[Math.floor(Math.random() * filmlist.length)])
  }
  return movies;
}

// router.get('/random', checkLoggedInUser, (req, res) => {
//     .then(result => {
//       for (e in movies) {
//         cli.get({
//           'name': movies[i]
//         })
//     }res.render('random.hbs', {
//       result
//     }))
//     .catch(err => console.log(err))
//   }
// });

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