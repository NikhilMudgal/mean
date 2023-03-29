const express = require('express');

const router = express.Router();

const checkAuth = require("../middleware/check-auth")
const extractFile = require("../middleware/file")
const postController = require('../controllers/post')



router.post("", checkAuth,extractFile, postController.createPosts);

router.get("", postController.getAllPosts);

router.get("/:id", postController.getPostById);

router.put("/:id", checkAuth,extractFile, postController.updatePost);

router.delete("/:id",checkAuth, postController.deletePost);

module.exports = router;
