const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express(); // this will return an express app
mongoose
  .connect(
    "mongodb+srv://nikhil_mudgal:N82813970@cluster0.fluzu.mongodb.net/posts?retryWrites=true&w=majority",
    {
      // In 'mongodb.net/posts' posts is the name of the database
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("Connected to Mongodb Database");
  })
  .catch((e) => {
    console.log(e);
    console.log("Connection Failed");
  });

// app.use((req, res, next) =>{      // use uses the middleware on our app and on the incoming request
//   console.log('First MiddleWare');
//   next();  // if next function is executed, then the request will actually continue its journey

// });   // use middleware on our app and on the incoming request

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images"))); // by default folders in backend are not allowed to be accessed . So to access them it is

app.use((req, res, next) => {
  // First Argument is Header Key and second argument is value for that header
  res.setHeader("Access-Control-Allow-Origin", "*");
  // line 13 means no matter which domain the app which is sending the request is running on, it is allowed to access our resources
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // First line allows which domain can access our resources and the second statement tells the incoming request may have these headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // it tells which http verbs may be used to send requests
  next();
});

app.use("/api/posts", postRoutes); // routes declared for posts in posts.js file of routes folder are now known by app.js
app.use("/api/user", userRoutes)

module.exports = app;
