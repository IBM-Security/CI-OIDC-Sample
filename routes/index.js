var request = require('request');
var express = require('express');
var router = express.Router();
var OIDC_BASE_URI = process.env.OIDC_CI_BASE_URI;
var OIDC_TOKEN_URI = OIDC_BASE_URI+'/oidc/endpoint/default';

// GET homepage 
router.get('/', function(req, res, next) {

  if(req.session.accessToken){
    // Log the user profile
    console.log(req.user);
    
    res.render('users', {
      title: 'Users',
      user: req.user,
      loggedin: (req.query.loggedin == 'success') ? true : false
    });
  }
  else{
    // If no session exists, show the index.hbs page
    res.render('index', {
    title: 'IBM Cloud Identity OpenID Connect Example',
    loggedout: (req.query.loggedout == 'success') ? true : false 
  });
  }
});

// GET profile
router.get('/profile', function(req, res, next) {

  request.get(`${OIDC_TOKEN_URI}/userinfo`, {
    'auth': {
      'bearer': req.session.accessToken
    }
  },function(err, response, body){

    console.log('User Info')
    console.log(body);

    pbody = JSON.parse(body);
    vbody = JSON.stringify(pbody, null, 2);

    res.render('profile', {
      title: 'Profile',
      user: pbody,
      fullJson: vbody
    });
  });
});

router.get('/introspect', function(req, res, next) {

  request.post(`${OIDC_BASE_URI}/introspect`, {
    'form': {
      'client_id': process.env.OIDC_CLIENT_ID,
      'client_secret': process.env.OIDC_CLIENT_SECRET,
      'token': req.session.accessToken,
      'token_type_hint': 'access_token'
      }
    },function(err, response, body){

    console.log('Introspect output')
    console.log(body);

    pbody = JSON.parse(body);
    vbody = JSON.stringify(pbody, null, 2);

    res.render('introspect', {
      title: 'Introspect',
      atoken: req.session.accessToken,
      introspect: pbody,
      fullJson: vbody
    });
  });
});

module.exports = router;
