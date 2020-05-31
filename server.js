const http = require('http');  // default nodejs package installed in the system
const app = require('./backend/app');

const port = process.env.PORT || 3000;

app.set('port', port);

// to use that app as a listener for incoming requests set the port of app and pass it as an argument in the createServer()
const server = http.createServer(app);

server.listen(port);
