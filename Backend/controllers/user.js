const bcrypt = require("bcrypt");
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const config = require('../../config.js');

const jwtKey = config.jwtKey;

exports.createUser =  (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // higher the number(10) more time it will take but it will be more safer
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created!',
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid authentication credentials!"
                });
            });
    });
};

exports.loginUser =  (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user
             return bcrypt.compare(req.body.password, user.password);// bcrypt.compare hashes the req.body.password and compares it with the hashed password stored in the database
        })
        .then(result => { // result will be boolean
            if (!result) {
                return res.status(401).json({
                    message: "Invalid authentication credentials!"
                });
            }
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 
                jwtKey,
                { expiresIn: "1h"}
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            });
        });
}

 // a hashed password can't be dehashed, but we you have the same input you will get same hash everytime!
 // npm install --save jsonwebtoken - this is used to install jsonwebtoken that will create a jwt token 