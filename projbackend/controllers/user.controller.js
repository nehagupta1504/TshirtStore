const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res, next) => {
  req.profile.salt = undefined; //After setting it to undefined it doesn't go to frontend
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body }, //paas all the values want to update in $set
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        req.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      user.salt = undefined; //After setting it to undefined it doesn't go to frontend
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      return res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name") // to bring id & name from user to order
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: " No Order in this account",
        });
      }
      return req.json(order);
    });
};

//-----------------middleware to fill userPurchaseList just like get user by ID
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = []; //empty array
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  //---------------store this purchases in purchases array of user model in db--------------
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};
