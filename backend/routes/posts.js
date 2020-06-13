const express = require('express');
const multer = require('multer');  // Multer is used to extract incoming files
const router = express.Router();

const Post = require("../models/post");

const MIME_TYPE_MAP =  {
  'image/png': 'png',
  'image/jpeg' : 'jpeg',
  'image/jpg' : 'jpg'
};

// configure multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if(isValid) {
      error = null;
    }
    cb(error, "backend/images")   // the path is relative to server.js file
  }, // this function is executed whenever multer tries to save a file
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + '.' + ext);
  }
});


router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host")  // this constructs url to our server
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save()   // save() is provided by mongoose package itself
  .then(createdPost => {
    res.status(201).json({
      message: "Post Added Successfully",
      post: {
        ...createdPost,
        Id: createdPost._id,
        }
    });
  });
  // the data will be saved in the collection whose name will be the plural name of the model and will be created automatically

});

router.get("", (req, res, next) => {
  Post.find()
  .then(documents => {
    console.log(documents);
    return res.status(200).json({
      posts: documents,
      message: "These are coming from router.js file",
    });
  });    // find() simply return all entries
  // without next() it will not continue travel down other middle wares and

});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post not found"});
    }
  })
});

router.put("/:id", (req,res,next) => {
  // put() will replace the existing object while patch updates the existing object
  const post = new Post({ _id: req.body.Id, title: req.body.title, content: req.body.content})
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({message: "Update Successfully"});
  })
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: "Post Deleted"});
  });
});

module.exports = router;
