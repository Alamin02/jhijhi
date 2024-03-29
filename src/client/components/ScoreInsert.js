/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */


import React from 'react';
import ScoreInput from './ScoreInput';
import * as PropTypes from 'prop-types';

function ScoreInsert(props) {
  const propsToBePassed = {
    ...props,
    injectBowlEvent: el => el,
    defaultHttpVerb: 'post',
    shouldResetAfterInput: true,
  };
  return <ScoreInput {...propsToBePassed}/>;
}

ScoreInsert.propTypes = {
  batsmen: PropTypes.arrayOf(PropTypes.object).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  matchId: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default ScoreInsert;
