/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 09, 2019
 */


import React, {Component} from "react";
import CenterContent from "./layouts/CenterContent";
import CheckBoxControl from "./form/control/checkbox";
import {bindMethods, subtract, toTitleCase} from "../lib/utils";
import FormGroup from "./form/FormGroup";
import FormButton from "./form/FormButton";
import fetcher from "../lib/fetcher";

export default class PreMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      team1Players: [],
      team2Players: [],
      team1Captain: '',
      team2Captain: '',
      isValid: {
        team1Captain: null,
        team2Captain: null,
      },
      feedback: {
        team1Captain: null,
        team2Captain: null,
      },
    };
    bindMethods(this);
  }

  handlers = {
    onButtonClick() {

    },
    onTeamPlayerChange(action) {
      this.setState(prevState => {
        if (action.select) {
          if (action.team === 1) {
            if (prevState.team1Players.indexOf(action.select) === -1) {
              return {team1Players: prevState.team1Players.concat(action.select)};
            }
            return {team1Players: prevState.team1Players};
          } else if (action.team === 2) {
            if (prevState.team2Players.indexOf(action.select) === -1) {
              return {team2Players: prevState.team2Players.concat(action.select)};
            }
            return {team2Players: prevState.team2Players};
          } else {
            throw new Error("Unknown Team");
          }
        } else if (action.unselect) {
          if (action.team === 1) {
            return {team1Players: prevState.team1Players.filter(player => player._id !== action.unselect)};
          } else if (action.team === 2) {
            return {team2Players: prevState.team2Players.filter(player => player._id !== action.unselect)};
          } else {
            throw new Error("Unknown Team");
          }
        } else {
          throw new Error("Unknown Action");
        }
      });
    },
  };


  componentDidMount() {
    fetcher
      .get('players')
      .then(response => {
        this.setState({players: response.data})
      });
  }


  render() {
    const getCheckboxOnChangeForTeam = (team, id) => {
      return (e) => this.onTeamPlayerChange({[e.target.checked ? 'select' : 'unselect']: id, team});
    };
    // if checkbox is checked, key is 'select' and 'unselect otherwise. value is the index
    const mapToCheckbox = (team, player) => {
      return (
        <CheckBoxControl name={`cb-${player.jerseyNo}`} onChange={getCheckboxOnChangeForTeam(team, player._id)}>
          {`${toTitleCase(player.name)} (${player.jerseyNo})`}
        </CheckBoxControl>
      );
    };

    const matcher = (el1, el2) => el1._id === el2;

    const getListItemMapperForTeam = team => (player, i) => (
      <li key={player._id} className="list-group-item bg-transparent flex-fill">{mapToCheckbox(team, player, i)}</li>
    );

    const team1CandidatePlayers = subtract(this.state.players, this.state.team2Players, matcher)
      .map(getListItemMapperForTeam(1));
    const team2CandidatePlayers = subtract(this.state.players, this.state.team1Players, matcher)
      .map(getListItemMapperForTeam(2));

    return (
      <CenterContent>
        <h2 className="text-center text-white bg-success py-3 rounded">{this.props.name}</h2>
        <div className="row">
          <div className="col">
            <h2 className="text-center text-primary">{this.props.team1.name}</h2>
            <hr/>
            <FormGroup label="Captain" type="select"
                       options={this.state.players.filter(el => this.state.team1Players.indexOf(el._id) !== -1)}
                       name="team1-captain" value={this.state.team1Captain}
                       onChange={(e) => this.onChange({team1Captain: e.target.value})}
                       isValid={this.state.isValid.team1Captain}
                       feedback={this.state.feedback.team1Captain}/>
            <div className="form-group row">
              <label className="col-form-label col-md-4 col-lg-3">
                Choose Players
              </label>
              <div className="col">
                <ul className="list-group-select">{team1CandidatePlayers}</ul>
              </div>
            </div>
          </div>
          <div className="col">
            <h2 className="text-center text-primary">{this.props.team2.name}</h2>
            <hr/>
            <FormGroup label="Captain" type="select"
                       options={this.state.players.filter(el => this.state.team2Players.indexOf(el._id) !== -1)}
                       name="team2-captain" value={this.state.team2Captain}
                       onChange={(e) => this.onChange({team2Captain: e.target.value})}
                       isValid={this.state.isValid.team2Captain}
                       feedback={this.state.feedback.team2Captain}/>
            <div className="form-group row">
              <label className="col-form-label col-md-4 col-lg-3">
                Choose Players
              </label>
              <div className="col">
                <ul className="list-group-select">{team2CandidatePlayers}</ul>
              </div>
            </div>
          </div>

        </div>
        <FormButton type="button" text="Begin Match" btnClass="outline-primary"
                    offsetCol="offset-0 text-center mt-3" onClick={this.onButtonClick}>
        </FormButton>
      </CenterContent>
    );
  }

}

