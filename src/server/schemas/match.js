/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


const { Schema } = require('mongoose');

module.exports = new Schema({
  name: String,
  team1: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  team2: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  team1OwnToss: Boolean,
  team1BatFirst: Boolean,
  umpire1: {
    type: Schema.Types.ObjectId,
    ref: 'Umpire',
  },
  umpire2: {
    type: Schema.Types.ObjectId,
    ref: 'Umpire',
  },
  umpire3: {
    type: Schema.Types.ObjectId,
    ref: 'Umpire',
  },
  team1Players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
  }],
  team2Players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
  }],
  team1Captain: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  team2Captain: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  innings: [{
    overs: {
      bowledBy: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
      bowls: [{
        playedBy: {
          type: Schema.Types.ObjectId,
          ref: 'Player',
        },
        isWicket: String,
        singles: {
          type: Number,
          default: 0,
        },
        boundary: {
          run: Number,
          kind: {
            type: String,
            enum: ['regular', 'by', 'legBy'],
          },
        },
        isWide: Boolean,
        isNo: String, // containing the reason of no
      }],
    },
  }],
});
