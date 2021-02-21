const UserModel = require('../models/User.model');
const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();
const uploader = require('../middlewares/cloudinary.config');


router.get('/profile', checkLoggedInUser, (req, res, next) => {
  let id = req.session.userData._id
  UserModel.findById(id)
    .then((user) => {
      res.render('profile/profile.hbs', {user});
    })
    .catch((err) => {
      next(err)
    })
})

router.post('/upload', uploader.single("imageUrl"),checkLoggedInUser, (req, res, next) => {
  console.log('file is: ', req.file)
  UserModel.findByIdAndUpdate(req.session.userData._id, {profilePic: req.file.path})
    .then(() => {
      res.redirect('/profile')
    })
  
  if (!req.file) {
    console.log("there was an error uploading the file");
    next(new Error('No file uploaded!'));
    return;
  }
})


router.get('/profile/:id/edit', checkLoggedInUser, (req, res, next) => {
  const {id} = req.params;
  UserModel.findById(id)
    .then((user) => {
      res.render('profile/update-profile.hbs', {user});
    })
    .catch((err) => {
      next(err);
    })
});

router.post('/profile/:id/edit', checkLoggedInUser, (req, res, next) => {
  const {id} = req.params;
  const {userUsername, userEmail} = req.body;

  UserModel.findByIdAndUpdate(id, {$set: req.body})
    .then((user) => {
      console.log(id)
      res.redirect('/profile');
    })
    .catch((err) => {
        next(err);
    })
});

module.exports = router;