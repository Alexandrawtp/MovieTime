const axios = require('axios');
const checkLoggedInUser = require('./middlewares')
const router = require("express").Router();
const GroupModel = require('../models/Group.model.js');
const UserModel = require('../models/User.model.js');

let api_key = process.env.API_KEY;

router.get('/groups', checkLoggedInUser, (req, res) => {
    const username = req.session.userData.username;
    GroupModel.find({
            "members.username": username
        })
        .then((groups) => {
            res.render('group/groups.hbs', {
                groups
            })
        })
})

const isAdmin = (username, group) => {
    for (let member of group.members) {
        if (member.username === username && member.status === 'admin') {
            return true;
        }
    }
    return false;
}

const getMoviesFromId = (movieIds) => {
    let promises = movieIds.map(
        (id) => axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`)
    )
    return axios.all(promises)
        .then(results => {
            return results.map((result) => result.data);
        })
        .catch((err) => {
            next(err);
        })
}

const getMembersLists = (members) => {
    const usernames = members
        .filter((member) => member.status !== 'pending')
        .map((member) => member.username);

    return UserModel.find({
            username: usernames
        })
        .then((users) => {
            let moviesIds = [];
            for (let user of users) {
                moviesIds = [...moviesIds, ...user.mylist];
            }
            return getMoviesFromId(moviesIds);
        })
        .catch((err) => {
            next(err);
        })
}

const getMembersUsers = (members) => {
    const usernames = members.map((member) => member.username);

    return UserModel.find({
        username: usernames
    })
}


const getStatus = (username, members) => {
    for (let member of members) {
        if (member.username === username)
            return member.status
    }
}


router.get('/group/:name', checkLoggedInUser, (req, res) => {
    const name = req.params.name;
    const username = req.session.userData.username;
    const profilePic = req.session.userData.profilePic;

    GroupModel.findOne({
            name
        })
        .then((group) => {
            const usersPromise = getMembersUsers(group.members)
            const moviesPromise = getMembersLists(group.members)
            Promise.all([usersPromise, moviesPromise])
                .then(([users, movies]) => {
                    const members = users.map((user) => {
                        return {
                            username: user.username,
                            profilePic: user.profilePic,
                            status: getStatus(user.username, group.members)
                        }
                    })
                    console.log(members)
                    res.render(
                        'group/group.hbs', {
                            group,
                            members,
                            isAdmin: isAdmin(username, group),
                            pendingUsers: group.members.filter((member) => member.status === 'pending'),
                            topMovies: movies,
                        })

                })
                .catch((err) => {
                    next(err);
                })
        })
        .catch((err) => {
            next(err);
        })
})

router.get('/groups/search', checkLoggedInUser, (req, res) => {
    const search = req.query.groupName

    GroupModel.find({
            name: {
                $regex: search,
                $options: "i"
            }
        })
        .then((groups) => {
            res.render('group/group-results.hbs', {
                groups
            })
        })
})

router.post('/groups/create', (req, res, next) => {
    const {
        name,
        description,
    } = req.body;

    const username = req.session.userData.username;

    const group = {
        name: name,
        description: description,
        members: [{
            username: username,
            status: 'admin'
        }]
    };

    GroupModel.create(group)
        .then(() => {
            GroupModel.find({
                    "members.username": username
                })
                .then((groups) => {
                    res.render('group/groups.hbs', {
                        groups,
                        msg: `${group.name} created !`
                    })
                })
        })
        .catch((e) => {
            console.log(e);
            GroupModel.find({
                    "members.username": username
                })
                .then((groups) => {
                    res.render('group/groups.hbs', {
                        groups,
                        err: "Error ..."
                    })
                })
        })
})

const isMember = (username, group) => {
    for (let member of group.members) {
        if (member.username === username) {
            return true
        }
    }
    return false
}

router.post('/group/:name/join', (req, res, next) => {
    const name = req.params.name;
    const username = req.session.userData.username;

    GroupModel.findOne({
            name
        })
        .then((group) => {
            if (!isMember(username, group)) {
                group.members.push({
                    username,
                    status: 'pending'
                });
                group.news.push({
                    username,
                    message: 'asked to join group'
                });
                group.save();
            }
            res.redirect('/groups');
        })
})

router.post('/group/:name/accept/:username', (req, res, next) => {
    const {
        name,
        username
    } = req.params;

    GroupModel.findOne({
            name
        })
        .then((group) => {
            for (let member of group.members) {
                if (member.username === username) {
                    member.status = 'member';
                }
            }
            group.news.push({
                username,
                message: 'joined the group'
            });
            group.save()
            res.redirect(`/group/${group.name}`);
        })
})

router.post('/group/:name/reject/:username', (req, res, next) => {
    const {
        name,
        username
    } = req.params;

    GroupModel.findOne({
            name
        })
        .then((group) => {
            group.members = group.members.filter((member) => member.username !== username)
            group.save()
            res.redirect(`/group/${group.name}`);
        })
})

router.post('/group/:name/delete', (req, res, next) => {
    const {
        name
    } = req.params;

    GroupModel.deleteOne({
            name
        })
        .then(() => {
            res.redirect("/groups");
        })
})

module.exports = router;