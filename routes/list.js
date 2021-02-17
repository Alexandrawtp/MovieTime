const axios = require('axios');
const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();
const UserModel = require('../models/User.model.js');

let api_key = process.env.API_KEY;

router.get('/my-list', checkLoggedInUser, (req, res) => {
  UserModel.findOne({
      username: req.session.userData.username
    })
    .then((user) => {
      let promises = user.mylist.map(
        (id) => axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`)
      )
      axios.all(promises)
        .then(results => {
          let movies = results.map((result) => result.data);
          res.render('my-list.hbs', {
            movies: movies
          });
        })
        .catch(err => console.log(err))
    })
});

router.post('/my-list', checkLoggedInUser, (req, res) => {
  const {
    id
  } = req.body;
  UserModel.findOne({
      username: req.session.userData.username
    })
    .then((user) => {
      if (!user.mylist.includes(id)) {
        user.mylist.push(id);
        user.save();
      }
      console.log(user.mylist);
      res.send({
        'status': "ok"
      })
    })
});

module.exports = router;