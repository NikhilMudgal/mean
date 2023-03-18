const express = require('express');
const bcrypt= require('bcrypt');

const User = require("../models/user")

const router = express.Router();

router.post("/signup", (req,res,next) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then((result) => {
        res.status(200).json({
            message: "User Created",
            result: result
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
      })
    })
    
})

module.exports = router