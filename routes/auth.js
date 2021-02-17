const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js');
const GroupModel = require('../models/Group.model.js');
const { MongooseDocument } = require("mongoose");
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
  let userId = req.session.userData._id;
  res.render('home.hbs')

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
  res.render('groups/groups.hbs');
});

router.get('/groups/details', checkLoggedInUser, (req, res) => {
  res.render('groups/details.hbs')
})

router.get('/groups/create', checkLoggedInUser, (req, res) => {
  res.render('groups/create.hbs')
})

//router.get('/groups/list', checkLoggedInUser, (req, res) => {
//  res.render('groups/list.hbs')
//})

// create a group

router.post('/groups/create', checkLoggedInUser, (req, res, next) => {
  const userId = req.session.userData._id

  const {
    groupname,
  } = req.body;

  if (!groupname.length) {
    res.render('groups/create', {
      msg: 'Please enter all fields'
    })
    return;
  }

  if (!userId.length) {
    res.render('groups/create', {
      msg: 'retry to login'
    })
    return;
  }


  GroupModel.create({
      groupname,
      owner: userId,
      isAdmin: true,
    })
    .then(() => {
      res.redirect('groups/details');
    })
    .catch((err) => {
      next(err);
    })
    
});

// list groups
/*
router.get("/groups/list", checkLoggedInUser, (req, res, next) => {
  console.log('test1')
  GroupModel.find()
  .then((groups) => {
    console.log(groups)
    res.render("groups/list.hbs", { groups })
  })
  .catch((err) => {
    console.log(err)
    next(err);
  })
});
*/

// find a group 

router.get('/groups/search', checkLoggedInUser, (req, res) => {
  res.render('groups/search.hbs');
});


router.post('/groups/search', checkLoggedInUser, (req, res, next) => {
  const {groupname} = req.body

  GroupModel.find(groupname)
    .then((groups) => {
      res.render("/groups/search.hbs", {groups})
      console.log('test1')
    })
    .catch((error) => {
      console.log('Error while getting the books from the DB: ', error);
      next(error);
    });
});



// Profile

/*
router.get("/profile/:id", checkLoggedInUser, (req, res, next) => {

  const { id } = req.params // destructure to get params. Good practice.
  // findById method will obtain the information of the drone to show in the update form view
  UserModel.findById(id)
  .then((users) => res.render("profile.hbs", { users }))
  .catch((err) => console.log(err));
  });
*/




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