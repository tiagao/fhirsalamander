import React from 'react';

import { PageConstants } from '../constants/AppConstants.js';
import AppStore from '../stores/AppStore.js';
import AppActionCreators from '../actions/AppActionCreators.js';

const getStateFromStores = () => {
  return {
    doctorName: AppStore.getDoctorName()
  };
};

export default class Doctor extends React.Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStores();
    this._onAppStoreChanged = this._onAppStoreChanged.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onAppStoreChanged);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onAppStoreChanged);
  }

  _onAppStoreChanged() {
    this.setState(getStateFromStores());
  }

  handleDoctorNameChange(event) {
    AppActionCreators.changeDoctorName(event.target.value);
  }

  render() {
    let goBack = function() {
      AppActionCreators.changePage(PageConstants.INTRO);
    };
    let goForward = function() {
      AppActionCreators.changePage(PageConstants.SPECIALTIES);
    };

    return (
      <div className="Doctor">
        <p>Is there a specific doctor or facility you're looking for?</p>
        <form>
          <div className="form-group">
            <label for="doctorName">Doctor name</label>
            <input type="text" className="form-control" placeholder="Doctor/facility name" onChange={this.handleDoctorNameChange} value={this.state.doctorName} />
          </div>
        </form>
        <div className="back-forward">
          <a className="btn btn-lg btn-danger" onClick={goBack}>Go back</a>
          <a className="btn btn-lg btn-success" onClick={goForward}>Next</a>
        </div>
      </div>
    );
  }
}
