var request = require('request');
var express = require('express');
var router = express.Router();
var OIDC_BASE_URI = process.env.OIDC_CI_BASE_URI;
var OIDC_TOKEN_URI = OIDC_BASE_URI+'/oidc/endpoint/default';

// GET profile
router.get('/profile', function(req, res, next) {

  request.get(`${OIDC_BASE_URI}/userinfo`, {
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

// GET profile
router.get('/launchpad', function(req, res, next) {

  request.get(`https://casesecurity.ice.ibmcloud.com/v1.0/user/applications`, {
    'auth': {
      'bearer': req.session.accessToken
    }
  },function(err, response, body){

    console.log('App Info')
    console.log(body);

    pbody = JSON.parse(body);
    vbody = JSON.stringify(pbody, null, 2);

    res.render('launchpad', {
      title: 'App Launchpad',
      apps: pbody,
      fullJson: vbody
    });
  });
});

// GET introspect profile
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
