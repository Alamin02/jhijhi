import React, { Component } from 'react';

export default class Score extends Component {
  render() {
    const {battingTeamName, tossOwner, firstBat, innings, inningsNo} = this.props;
    let totalRun = 0, totalWicket = 0;
    for (const over of innings.overs) {
      for (const bowl of over.bowls) {
        if (bowl.isWicket) {
          totalWicket++;
        }
        if (bowl.singles) {
          totalRun += bowl.singles;
        }
        if (bowl.by) {
          totalRun += bowl.by;
        }
        if (bowl.legBy) {
          totalRun += bowl.legBy;
        }
        if (bowl.boundary.run) {
          totalRun += bowl.boundary.run;
        }
        if (bowl.isWide || bowl.isNo) {
          totalRun++;
        }
      }
    }

    let numOvers = innings.overs.length - 1;
    let numBowls = innings.overs[innings.overs.length - 1].bowls.reduce((numValidBowls, bowl) => {
      if (!bowl.isWide && !bowl.isNo) {
        return numValidBowls + 1;
      }
      return numValidBowls;
    }, 0);

    if (numBowls === 6) {
      numOvers++;
      numBowls = null;
    }

    return <>
      <div className='bg-dark text-info p-2 mt-5'>
        <h4 className="mt-3 text-white">{battingTeamName} - {totalRun} / {totalWicket}</h4>
        <h5>
          <small>After</small>
          &nbsp;{numOvers} overs {numBowls && `${numBowls} bowl${(numBowls > 1)? 's': ''}`}
        </h5>
        <h6>Innings {inningsNo}</h6>
      </div>
      <div className="mt-3 text-white">
        <h5>
          <small>
            {tossOwner} won the toss. <br/>
            {firstBat} will bat first.
          </small>
        </h5>

      </div>
    </>;
  }
}