var express = require("express");
var router = express.Router();
// const cors = require("cors");
const jwtManager = require("../jwt/jwtManager");

const hasher = require("bcryptjs");

//login
router.post("/login", (req, res) => {
  req.db
    .collection("users")
    .findOne({ email: req.body.email, password: req.body.password })
    .then((data) => {
      console.log("newwwwwwwwwwwww", data);
      if (data) {
        const payload = {};
        payload.email = data.email;
        payload.name = data.name;
        const token = jwtManager.generate(payload);
        console.log("token", token);
        payload.token = token;
        res.json({ status: "success", result: payload });
      } else {
        res.json({ status: "User not exist" });
      }
    });
});

//sign up
router.post("/signup", (req, res) => {
  req.db
    .collection("users")
    .findOne({ email: req.body.email })
    .then((doc) => {
      if (doc) {
        res.json({ status: "User exists" });
      } else {
        const user = req.body;
        //checking email @miu.edu
        let x = req.body.email.indexOf("@");
        let y = req.body.email.length;
        let correctEmailFormat = req.body.email.slice(+x, +y);
        console.log("cutt email:", req.body.email.slice(+x, +y));

        console.log("passsword", req.body.password);
        if (
          req.body.email !== undefined &&
          req.body.name !== undefined &&
          req.body.password !== undefined
        ) {
          if (correctEmailFormat === "@miu.edu") {
            req.db
              .collection("users")
              .insertOne(user)
              .then((data) => {
                res.json({ status: "success" });
              });
          } else {
            res.json({ status: "invalid email" });
          }
        }
      }
    });
});

module.exports = router;
