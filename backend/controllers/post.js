const Post = require("../models/post");

exports.createPosts = (req, res, next) => {
    // multer gives info about the file to be stored in the req body
    const url = req.protocol + '://' + req.get("host")  // this constructs url to our server
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
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
    }).catch((error) => {
      res.status(500).json({
        message: "Creating a post Failed"
      })
    })
    
    // the data will be saved in the collection whose name will be the plural name of the model and will be created automatically
  
  }

  exports.getAllPosts = (req, res, next) => {
    const pageSize = +req.query.pageSize; // by default query parameters will always have data in string. To convert them to numbers add '+' in the begining
    const currentPage = +req.query.page;
    console.log(req.query);
    const postQuery = Post.find(); // this will not be executed until we call then
    let fetchedPosts;
    if(pageSize && currentPage) {
      // skip() means we will not retrieve all elements but will skip the the first n posts
      postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize) // limit tells the amount of documents to be returned
    }
    postQuery
    .then(documents => {
      fetchedPosts = documents
      return Post.countDocuments();
    }).then(count => {
      return res.status(200).json({
        posts: fetchedPosts,
        message: "These are coming from router.js file",
        maxPosts: count
      });
    }).catch((error) => {
      res.status(500).json({
        message: 'Fetching Post Failed'
      })
    });    // find() simply return all entries
    // without next() it will not continue travel down other middle wares and
  
  }

  exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if(post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found"});
      }
    }).catch((error) => {
      res.status(500).json({
        message: 'Fetching Post Failed'
      })
    })
  }

  exports.updatePost = (req,res,next) => {
    // put() will replace the existing object while patch updates the existing object
    let imagePath = req.body.imagePath;
    if(req.file) {
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({ _id: req.body.Id, title: req.body.title, content: req.body.content, imagePath: imagePath, creator: req.userData.userId })
    console.log(post);
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
      console.log(result)
      if(result.nModified > 0) {
        res.status(200).json({message: "Update Successfully"});
      } else {
        res.status(401).json({message: "Not Authorised"});
      }
    }).catch((error) => {
      res.status(500).json({
        message: 'Could not update post'
      })
    })
  }

  exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
      console.log('deleted', result);
      if(result.deletedCount >= 1) {
        res.status(200).json({message: "Post Deleted"});
      } else {
        res.status(401).json({message: "Not Authorised"});
      }
    }).catch((error) => {
      res.status(500).json({
        message: 'Deleting Post Failed'
      })
    });
  }