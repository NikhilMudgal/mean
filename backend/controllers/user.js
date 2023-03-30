const bcrypt= require('bcrypt');
const User = require("../models/user");
const jwt= require('jsonwebtoken');

exports.createUser = (req,res,next) => {
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
        }).catch(err => {
            res.status(500).json({
             message: 'Invalid Authentication Credentials'   
            });
      })
    })
}

exports.userLogin = (req,res,next) => {
    // to login we are first validating the email
    console.log(req.body.email)
    let fetchedUser;
    User.findOne({ email: req.body.email})
    .then((user) => {
        console.log('user', user)
        if(!user) {
            return res.status(401).json({
                message: 'Auth Failed'
            })
        }
        fetchedUser = user
        return bcrypt.compare(req.body.password, user.password) // we have encrypted the password but cannot decrypt it. So we are comparing the input value(unencrypted) with the encrypted value using bcrypt.compare()
    })
    .then(result => {
        console.log(result);
        if(!result) {
            return res.status(401).json({
                message: 'Auth Failed'
            })
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_KEY, {expiresIn: '1h'}); // JWT_KEY will be injected during the runtime as nodejs has this inbuilt functionality
        console.log(token)
        res.status(200).json({
            token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    }).catch(err => {
        console.log(err);
        return res.status(401).json({
            message: 'Invalid Authentication Credentials!!'
        })
    })
}