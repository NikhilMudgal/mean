const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {

      const token = req.headers.authorization.split(" ")[1];
      // to verify the token jwt uses verify() function along with token and secret key used to create that token and will throw an error if token is invalid
      jwt.verify(token, "secret_this_should_be_longer")
      next()
    } catch(error) {
        res.status(401).json({message: "Auth Failed"})
    }
}