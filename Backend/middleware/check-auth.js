const jwt = require("jsonwebtoken");

const config = require('../../config.js');

const jwtKey = config.jwtKey;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, jwtKey);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    console.log(req.userData)
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
