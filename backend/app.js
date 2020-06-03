const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post");

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
  .catch(() => {
    console.log("Connection Failed");
  });

// app.use((req, res, next) =>{      // use uses the middleware on our app and on the incoming request
//   console.log('First MiddleWare');
//   next();  // if next function is executed, then the request will actually continue its journey

// });   // use middleware on our app and on the incoming request

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // First Argument is Header Key and second argument is value for that header
  res.setHeader("Access-Control-Allow-Origin", "*");
  // line 13 means no matter which domain the app which is sending the request is running on, it is allowed to access our resources
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // First line allows which domain can access our resources and the second statement tells the incoming request may have these headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  ); // it tells which http verbs may be used to send requests
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  post.save(); // save() is provided by mongoose package itself
  // the data will be saved in the collection whose name will be the plural name of the model and will be created automatically
  res.status(201).json({
    message: "Post Added Successfully",
  });
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      Id: "154651cds535",
      title: "This is a post",
      content: "This is coming from server",
    },
    {
      Id: "789fgfd8g7",
      title: "This is a second post",
      content: "This is coming from server as well",
    },
  ];
  // without it will not continue travel down other middle wares and
  return res.status(200).json({
    posts: posts,
    message: "These are coming from app.js file",
  });
});

module.exports = app;
