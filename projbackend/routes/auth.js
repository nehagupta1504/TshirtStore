var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "name should be atleast 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password should be atleast 3 chars").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isLength({
      min: 3,
    }),
  ],
  signin
);

router.get("/signout", signout);

//isSignedIn is using JWT for authentication of a user will place the token which we get while signin & put it in the headers

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
