var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jwt = require('jsonwebtoken');  //https://npmjs.org/package/node-jsonwebtoken
var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt

var secret = 'This is the secret for signing tokens';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/'));

app.post('/login', function(req, res) {
  if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
    res.status(401).send('Wrong user or password');
    console.log('failed login');
    return;
  }
  // We are sending the profile inside the token
  var token = jwt.sign({ firstname: 'John', lastname: 'Doe'}, secret, { expiresInMinutes: 1 });
  res.json({ token: token });
});

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: secret}));

app.get('/api/profile', function (req, res) {
  console.log('user ' + req.user.firstname + ' is calling /api/profile');
  res.json({
    name: req.user.firstname
  });
});

app.listen(8080, function () {
  console.log('listening on http://localhost:8080');
});
