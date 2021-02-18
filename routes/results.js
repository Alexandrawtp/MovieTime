const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();
const axios = require('axios');

let api_key = process.env.API_KEY;

router.post('/results', checkLoggedInUser, (req, res) => {
    const {
        movieName
    } = req.body;

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${movieName}`

    axios.get(url)
        .then(result => {
            let movies = result.data.results;
            res.render('results.hbs', {movies});
        })
        .catch(err => console.log(err))
});

module.exports = router;