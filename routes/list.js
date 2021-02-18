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

const isPending = (username, group) => {
    for (let member of group.members) {
        if (member.username === username && member.status === 'pending') {
            return true
        }
    }
    return false
}

const addNews = (username, movie_id) => {
    const movie = axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}`)
    const groups = GroupModel.find({
        "members.username": username
    })

    Promise.all([movie, groups]).then(([movie, groups]) => {
        for (let group of groups) {
            if (!isPending(username, group)) {
                group.news.push({
                    username,
                    message: `added ${movie.data.title} to its list`
                });
            }
            group.save();
        }
    })
}

router.post('/my-list', checkLoggedInUser, (req, res) => {
    const {
        id
    } = req.body;
    const username = req.session.userData.username;

    UserModel.findOne({
            username: req.session.userData.username
        })
        .then((user) => {
            if (!user.mylist.includes(id)) {
                user.mylist.push(id);
                user.save();
                addNews(username, id)
            }
            res.send({
                'status': "ok"
            })
        })
});

router.post('/my-list/:id/delete', (req, res, next) => {
    const {
        id
    } = req.params; //id of api film you want to delete
    const userid = req.session.userData._id;
    console.log(id);


    UserModel.findById(userid)
        .then((resu) => {
            console.log(resu.mylist) 
            let newArr = resu.mylist.filter((e) => e !== id);
            UserModel.findByIdAndUpdate(userid, {mylist: newArr})
                .then(() => {
                    res.redirect('/my-list')
                })
                .catch((err) => next(err))
        })
        .catch(err => next(err))
})

module.exports = router;