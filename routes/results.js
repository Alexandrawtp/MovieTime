const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();

/* Results */

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