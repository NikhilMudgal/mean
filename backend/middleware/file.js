const multer = require('multer');  // Multer is used to extract incoming files

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
  

  module.exports = multer({storage: storage}).single("image")