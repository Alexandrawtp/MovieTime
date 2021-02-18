const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();
const axios = require('axios');

let api_key = process.env.API_KEY;

let typeIDs = {
    'comedy': 35,
    'action': 28,
    'romantic': 10749,
    'sci-fi': 878,
}

router.get('/random/:id', checkLoggedInUser, (req, res, next) => {
    const type = req.params.id;
    const randomPage = Math.floor(Math.random() * 15);
    const url = (
        type in typeIDs ?
        `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${typeIDs[type]}&page=${randomPage}` :
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&page=${randomPage}`
    );

    axios.get(url)
        .then(result => {
            let movies = displayRandomFilms(result)
            res.render('results.hbs', {
                movies
            });
        })
        .catch(err => console.log(err))
});

function displayRandomFilms(result) {
    return result.data.results.sort(
        () => 0.5 - Math.random()
    ).slice(0, 4);
}

module.exports = router;