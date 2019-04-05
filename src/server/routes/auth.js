const express = require('express');

/**
 * Index router
 * @var router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', {session: false});
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require("bcrypt");


router.get('/user', authenticateJwt(), function (request, response) {
  response.json(request.user);
});

router.post('/register', function (request, response) {
  const {username, password} = request.body;

  bcrypt
    .hash(password, 10)
    .then(hashedPassword => {
      return User.create({
        username: username,
        password: hashedPassword,
      });
    })
    .then(user => {
      response.json(user);
    })
    .catch(err => {
      response.json(err);
    });
});

router.post('/login', function (request, response) {
  const {username, password} = request.body;

  User
    .findOne({username})
    .exec()
    .then(user => {
      bcrypt
        .compare(password, user.password)
        .then(matched => {
          if (matched) {
            const token = jwt.sign(user._id.toString(), request.app.get('db'));
            return response.json({success: true, 'token': token});
          }
          return response.json({success: false});
        });
    });
});

module.exports = router;
