const express = require("express");

const UserController = require("../controllers/user")

const router = express.Router();

router.post("/signup", UserController.createUser)

router.post("/login", UserController.loginUser)

 module.exports = router;

 // a hashed password can't be dehashed, but we you have the same input you will get same hash everytime!
 // npm install --save jsonwebtoken - this is used to install jsonwebtoken that will create a jwt token 