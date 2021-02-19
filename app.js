// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "movies-project";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with IronGenerator`;

// 👇 Start handling routes here
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

app.use(session({
    secret: 'workplease',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24,
    })
}));

const auth = require("./routes/auth");
app.use("/", auth);

const profile = require("./routes/profile");
app.use("/", profile);

const myList = require("./routes/list");
app.use("/", myList);

const groups = require("./routes/groups");
app.use("/", groups);

const random = require("./routes/random");
app.use("/", random);

const results = require("./routes/results");
app.use("/", results);

const index = require("./routes/index");
app.use("/", index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;