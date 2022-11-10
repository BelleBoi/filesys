const express = require('express')
const app = express()
const router = express.Router()
const path = require('path')
const port = 3000;

// tell the server which files are for the client
app.use(express.static(__dirname + '/public'))

// send index.html to client when '/' url is requested
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

router.get('/make-pmv', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/make-pmv'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// note for later
// https://imagekit.io/blog/client-side-file-upload/