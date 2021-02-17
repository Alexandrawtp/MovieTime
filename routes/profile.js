const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();

router.get('/profile', checkLoggedInUser, (req, res) => {
    res.render('profile.hbs');
});

/*
router.get("/profile/:id", checkLoggedInUser, (req, res, next) => {

  const { id } = req.params // destructure to get params. Good practice.
  // findById method will obtain the information of the drone to show in the update form view
  UserModel.findById(id)
  .then((users) => res.render("profile.hbs", { users }))
  .catch((err) => console.log(err));
  });
*/

module.exports = router;