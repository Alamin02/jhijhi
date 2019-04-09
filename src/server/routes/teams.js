const express = require('express');

/**
 * User router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const Team = require("../models/team");
const responses = require("../responses");
const passport = require('passport');
const authenticateJwt = passport.authenticate.bind(passport, 'jwt', {session: false});
const {check, validationResult} = require('express-validator/check');
const {Types: {ObjectId}} = require("mongoose");


const teamCreateValidations = [
  check('name').exists({checkFalsy: true})
    .custom(name => {
      return Team
        .findOne({name: name})
        .exec()
        .then(team => {
          if (team) {
            return Promise.reject("Team Name already taken.");
          }
          return Promise.resolve();
        });
    }),
  check('shortName', 'Short name should be at least 2 characters')
    .isAscii({min: 1})
    .isLength({min: 2}),
  check('shortName')
    .custom(shortName => {
      return Team
        .findOne({shortName: shortName})
        .exec()
        .then(team => {
          if (team) {
            return Promise.reject("This short name is already taken.");
          }
          return Promise.resolve();
        });
    }),
];

router.get('/:id', authenticateJwt(), (request, response) => {
  Team
    .findOne({_id: request.params.id})
    .lean()
    .populate('players')
    .then(teams => response.json(teams))
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.teams.index.err,
        err: err.error || err.errors || err,
      });
    })
});

/* GET teams listing. */
router.get('/', authenticateJwt(), (request, response) => {
  Team
    .find({creator: request.user._id})
    .lean()
    .then(teams => response.json(teams))
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.teams.index.err,
        err: err.error || err.errors || err,
      });
    })
});

router.post('/', authenticateJwt(), teamCreateValidations, (request, response) => {
  const errors = validationResult(request);
  const promise = errors.isEmpty() ? Promise.resolve() : Promise.reject({status: 400, errors: errors.array()});
  const {name, shortName, players} = request.body;

  promise
    .then(() => Team.create({
      name,
      shortName,
      players: players.map(playerId => new ObjectId(playerId)),
      creator: request.user._id,
    }))
    .then(createdTeam => {
      response.json({
        success: true,
        message: responses.teams.create.ok(name),
        team: {_id: createdTeam._id},
      });
    })
    .catch(err => {
      response.status(err.statusCode || err.status || 500);
      response.json({
        success: false,
        message: responses.teams.create.err,
        err: err.error || err.errors || err,
      });
    })
});

module.exports = router;