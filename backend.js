var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


const PORT = process.env.PORT;

app.disable('x-powered-by');

app.get('/', function(req, res) {
  console.log(req.query.img);

  var file = path.join(__dirname, '/paint.html');
  res.sendFile(file); 
});

app.post('/', function (req, res) {
  
  console.log(req);
  console.log(req.body);
  console.log(req.body.lol);

}
)

app.use('/public', express.static(path.join(__dirname, '/public')));
app.listen(PORT, function() {
  console.log("Server up at http://localhost:8080");
});




