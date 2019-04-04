/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component, Fragment } from 'react';
import Ball from './Ball';
import NextBall from './NextBall';

class CurrentOver extends Component {
  balls;
  bowler;
  onCrease;

  render() {
    return (
      <Fragment>
        <h4 className="mt-3 text-center">
          <span className="font-italic">{this.props.bowler}</span> is bowling
        </h4>
        <ul className="list-group">
          {this.props.balls.map(
            (ball, i) => {
              const props = {
                key: i,
                isWicket: ball.isWicket,
                boundary: ball.boundary,
                run: ball.run,
                batsman: ball.batsman,
              };
              return (<Ball {...props}/>);
            },
          )}
          <NextBall onCrease={this.props.onCrease}/>
        </ul>
      </Fragment>
    );
  }

}

export default CurrentOver;
