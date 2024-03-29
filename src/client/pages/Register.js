/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import {bindMethods} from "../lib/utils";
import axios from "axios";


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        username: '',
        password: '',
        confirm: '',
      },
      isValid: {
        username: null,
        password: null,
      },
      feedback: {
        username: null,
        password: null,
      },
    };
    this.cancelTokenSource = axios.CancelToken.source();
    bindMethods(this);
  }

  handlers = {
    onSubmit() {
      const postData = {...this.state.values};

      axios
        .post('/api/auth/register', postData, {cancelToken: this.cancelTokenSource.token})
        .then(() => {
          this.props.history.push('/login');
          return window.location.href = "";
        })
        .catch(err => {
          const isValid = {
            username: true,
            password: true,
          };
          const feedback = {
            username: null,
            password: null,
          };
          for (const error of err.response.data.err) {
            if (isValid[error.param]) {
              isValid[error.param] = false;
            }
            if (!feedback[error.param]) {
              feedback[error.param] = error.msg;
            }
          }

          this.setState({isValid, feedback});
        });
    },

    onChange(newValues) {
      this.setState(prevState => ({values: {...prevState.values, ...newValues}}));
    },
  };

  componentWillUnmount() {
    this.cancelTokenSource.cancel();
  }

  render() {
    return (
      <AuthForm title="Register" onChange={this.onChange} onSubmit={this.onSubmit} values={this.state}
                isValid={this.state.isValid} feedback={this.state.feedback} confirmPassword={true}
                btnClass="outline-success">
        <label className="col-form-label float-right">
          Already Registered? <Link to="/login">Login</Link>
        </label>
      </AuthForm>
    );
  }

}

export default Register;
