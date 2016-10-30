var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser')
var firebase = require('firebase')


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCo2nBtCq0VfYveGllVKYfN_7Mv5kzjuiw",
    authDomain: "grasp-pics.firebaseapp.com",
    databaseURL: "https://grasp-pics.firebaseio.com",
    storageBucket: "grasp-pics.appspot.com",
    messagingSenderId: "319098415620",
    serviceAccount: "grasp_key.json"
   };
  firebase.initializeApp(config);

var database = firebase.database();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var PORT = process.env.PORT || 8080;

app.disable('x-powered-by');

app.get('/', function(req, res) {

  console.log(req.query.img);

  var img = parseInt(req.query.img);
  if (img != null && img % 5 === 0) {
    var file = path.join(__dirname, '/paint.html');
    res.sendFile(file); 
  } else {
    res.status(404).send('This page not found on this server!');
  }
});

app.get('/thanks', function(req, res) {
  console.log('thanks');
  res.sendFile(path.join(__dirname, '/thanks.html'));
}
);

app.post('/', function (req, res) {
  console.log(req.body);
  var v = req.body;
  if (v.win === '1') {
    writeBoundingBox(v.filename, v.x1, v.y1, v.x2, v.y2);
  } else {
    writeEmpty(v.filename);
  }
  res.end("success");
}
);

function writeBoundingBox(imgId, x, y, width, height) {
  database.ref( imgId).set({
    box: {win: true, filename: imgId, x:x, y:y, width:width, height:height}  
  });
}

function writeEmpty(imgId) {
  database.ref(imgId).set({
    box: {win:false, filename: imgId}  
  });
}


app.use('/public', express.static(path.join(__dirname, '/public')));
app.listen(PORT, function() {
  console.log("Server up at http://localhost:" + PORT);
});




