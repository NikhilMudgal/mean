const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {

      const token = req.headers.authorization.split(" ")[1];
      // to verify the token jwt uses verify() function along with token and secret key used to create that token and will throw an error if token is invalid
      const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
      // express js give us the ability to add new key properties in the req object and will keep the fields which were added while moving to next middleware if we add next()
      req.userData = { email: decodedToken.email, userId: decodedToken.userId };
      next()
      // each and every middleware running after check auth middleware will get the extra info
    } catch(error) {
        res.status(401).json({message: "Auth Failed"})
    }
}