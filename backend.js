var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser')
var firebase = require('firebase')
var crypto = require('crypto');
var session = require('express-session');
var my_secret = 'grasp_secret';
var PORT = process.env.PORT || 8080;

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

//set up app
app.set('view engine', 'pug');
app.use(session({secret: my_secret}));
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.disable('x-powered-by');

app.get('/', function(req, res) {

  var img = parseInt(req.query.img);
  if (img != null && img % 5 === 0) {
    var file = path.join(__dirname, '/paint.html');
    res.sendFile(file); 
  } else {
    res.status(404).send('This page not found on this server!');
  }
});

app.post('/', function (req, res) {
  console.log(req.body);
  var v = req.body;
  if (v.win === '1') {
    writeBoundingBox(v.filename, v.x1, v.y1, v.x2, v.y2);
  } else {
    writeEmpty(v.filename);
  }

  if (Number(v.filename) % 5 == 4) {
    req.session.filename = v.filename;
    res.send("success");
    // res.redirect('/thanks');
  } else {
    res.send("success");
  }
}
);

var confCode = function (num) {
  return crypto.createHash('sha256').update(my_secret + num).digest('base64').substring(0,5).toUpperCase();
}

app.get('/thanks', 
  function(req, res) {
    var filename = req.session.filename;
    req.session.destroy();

    if (!filename) {
      res.render('thanks',{conf:""});
    } else {
      code = confCode(filename);
      writeConfCode(Number(filename) - 4, code);
      res.render('thanks', {conf: code});
    }
  }
);

function writeConfCode(imgId, code) {
  database.ref(imgId).update({code: code});
}

function writeBoundingBox(imgId, x, y, width, height) {
  database.ref(imgId).set({
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




