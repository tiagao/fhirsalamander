import React from 'react';

import { PageConstants } from '../constants/AppConstants.js';
import AppStore from '../stores/AppStore.js';
import AppActionCreators from '../actions/AppActionCreators.js';

const getStateFromStores = () => {
  return {
    specialties: AppStore.getSpecialties()
  };
};

export default class Specialties extends React.Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStores();
    this._onAppStoreChanged = this._onAppStoreChanged.bind(this);
    this.handleSpecialtiesChanged = this.handleSpecialtiesChanged.bind(this);
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

  handleSpecialtiesChanged(event) {
    let specialties = [];

    if(this.refs.acupuncture.checked) {
      specialties.push("ACUPUNCTURE");
    }
    if(this.refs.cardiac.checked) {
      specialties.push("CARDIAC DIAGNOSTIC");
    }
    if(this.refs.pain.checked) {
      specialties.push("PAIN MANAGEMENT");
    }

    AppActionCreators.changeSpecialties(specialties);
  }

  render() {
    function arrayHasElement(theArray, theElement) {
      for(var i = 0; i < theArray.length; i++) {
        if(theArray[i] == theElement) {
          return true;
        }
      }
      return false;
    }

    let hasAcupuncture = arrayHasElement(this.state.specialties, "ACUPUNCTURE");
    let hasCardiac = arrayHasElement(this.state.specialties, "CARDIAC DIAGNOSTIC");
    let hasPain = arrayHasElement(this.state.specialties, "PAIN MANAGEMENT");

    let goBack = function() {
      AppActionCreators.changePage(PageConstants.DOCTOR);
    };
    let goForward = function() {
      AppActionCreators.changePage(PageConstants.RESULTS);
    };

    return (
      <div className="Specialties">
        <p>Are you looking for particular specialties?</p>
        <form>
          <div className="checkbox">
            <label>
              <input type="checkbox" ref="acupuncture" onChange={this.handleSpecialtiesChanged} checked={hasAcupuncture} /> Acupuncture
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" ref="cardiac" onChange={this.handleSpecialtiesChanged} checked={hasCardiac} /> Cardiac diagnostic
            </label>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" ref="pain" onChange={this.handleSpecialtiesChanged} checked={hasPain} /> Pain management
            </label>
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
