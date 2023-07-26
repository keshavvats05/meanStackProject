const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://kesahvvats:admin@keshavcluster.kfyfui4.mongodb.net/node-angular").then(() => {
    console.log('connected to database')
}).catch(() => {
    console.log('connection failed');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});
app.post("/api/posts", (req, res, next) => {
    const posts = new Post({title: req.body.title, content: req.body.content}) // body is the new field added because of body parser
    posts.save();


    // 201 means everything is okay and new resource was created
    res.status(201).json({message: 'Post added successfully'});
});
app.get("/api/posts", (req, res, next) => {
    Post.find().then(doucuments => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: doucuments})

    })
    // 200 means everything was okay
});

module.exports = app;
