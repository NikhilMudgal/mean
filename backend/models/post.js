const mongoose = require('mongoose');  // using third party package mongoose for schema

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);
