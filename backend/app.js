const express = require('express');

const app = express();  // this will return an express app

app.use((req, res, next) =>{      // use uses the middleware on our app and on the incoming request
  console.log('First MiddleWare');
  next();  // if next function is executed, then the request will actually continue its journey

});   // use middleware on our app and on the incoming request

app.use((req, res, next) =>{

      // without it will not continue travel down other middle wares and
  res.send('Hello from express');
});

module.exports = app;
