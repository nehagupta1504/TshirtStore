const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const user = new User(req.body); //creating a object of User tyoe
  console.log(req.body);

  //return 2 things 1 is error another is user itself
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body; //------------------Destructuring of data, extracting email & password from user body

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errormsg: errors.array()[0].msg,
    });
  }
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: " User email doesn't exists",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: " Email & password doesn't match",
      });
    }

    //------------------Everything is good so create a token & put it in cookies------------------

    //------------------Creating token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //------------------Putting token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //------------------Send response to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: " User Signout successfully",
  });
};

//------------------protected routes------------------

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//------------------cutome middlewares------------------

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id; // we'll give some property (profile) at the frontend
  if (!checker) {
    return res.status(403).json({
      error: " ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Acess denied",
    });
  }
  next();
};
