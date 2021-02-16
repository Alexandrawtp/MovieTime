const router = require("express").Router();
const checkLoggedInUser = require('./routes/auth.js')
const cli = new imdb.Client({
  apiKey: '6170a01b'
});

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