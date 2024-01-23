const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const Post = require('./models/post');
const mongodb = require('mongodb')
const path = require("path")

const postsRoutes =require("./routes/post");
const userRoutes = require("./routes/user");

const app = express();

const config = require('../config.js');

const mongodbKey = config.mongodbKey;


mongoose.connect("mongodb+srv://kesahvvats:" + mongodbKey +"@keshavcluster.kfyfui4.mongodb.net/node-angular").then(() => console.log("Database connected!")).catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

app.use("/api/posts",postsRoutes)
app.use("/api/user",userRoutes)


module.exports = app;
