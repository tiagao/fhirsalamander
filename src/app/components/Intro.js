import React from 'react';

import { PageConstants } from '../constants/AppConstants.js';
import { AppStore } from '../stores/AppStore.js';
import AppActionCreators from '../actions/AppActionCreators.js';

export default class Intro extends React.Component {
  handleGetStartedOnClick() {
    AppActionCreators.changePage(PageConstants.DOCTOR);
  }

  render() {
    return (
      <div className="Intro">
        <div className="jumbotron">
          <h1>Welcome to FHIRSalamander</h1>
          <p>Let's find you health insurance</p>
          <p>
            <a className="btn btn-lg btn-primary" onClick={this.handleGetStartedOnClick}>Get started</a>
          </p>
        </div>
      </div>
    );
  }
}
