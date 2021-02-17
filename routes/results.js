const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();
const imdb = require('imdb-api');
const cli = new imdb.Client({
    apiKey: process.env.API_KEY
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

module.exports = router;