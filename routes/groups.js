const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();
const GroupModel = require('../models/Group.model.js');
const { MongooseDocument } = require("mongoose");


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

module.exports = router;