const axios = require('axios');
const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();
const UserModel = require('../models/User.model.js');

let api_key = process.env.API_KEY;

router.get('/groups', checkLoggedInUser, (req, res) => {
  const {username} = req.session.userData.username;
  res.render('groups.hbs', {username})
})
module.exports = router;