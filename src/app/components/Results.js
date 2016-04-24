import React from 'react';

import { PageConstants } from '../constants/AppConstants.js';
import AppStore from '../stores/AppStore.js';
import AppActionCreators from '../actions/AppActionCreators.js';

import ProviderPlans from './ProviderPlans.js';

const getStateFromStores = () => {
  return {
    doctorName: AppStore.getDoctorName(),
    specialties: AppStore.getSpecialties(),
    results: AppStore.getResults(),
    isFetching: AppStore.isFetching()
    // isFetchingProviderPlans: AppStore.isFetchingProviderPlans(),
    // providerPlans: AppStore.getProviderPlans()
  };
};

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStores();
    this._onAppStoreChanged = this._onAppStoreChanged.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onAppStoreChanged);

    let getParams = {
      doctorName: this.state.doctorName,
      specialties: this.state.specialties
    };

    AppActionCreators.changeIsFetching(true);

    $.ajax({
      url: "/getResults",
      dataType: "json",
      type: "GET",
      data: getParams
    }).done(function(results) {
      AppActionCreators.changeResults(results);
    });
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onAppStoreChanged);
  }

  _onAppStoreChanged() {
    this.setState(getStateFromStores());
  }

  render() {
    let goBack = function() {
      AppActionCreators.changePage(PageConstants.SPECIALTIES);
    };

    let individualProviders = this.state.results.individuals || [];
    let facilityProviders = this.state.results.facilities || [];

    let gettingResults = (<p>Getting results...</p>);
    let results = (
      <div>
        <h3>Individual Providers</h3>
        {individualProviders.map((provider, i) => {
          return (
            <div className="Provider Provider-Individual">
              <div className="name">{provider.name_first} {provider.name_last}</div>
              <div className="label">Speciality</div>
              <div className="speciality">{provider.speciality}</div>
              <div className="label">National ID</div>
              <div className="npi">{provider.npi}</div>
              <ProviderPlans npi={provider.npi} key={i} />
            </div>
          );
        })}
        <h3>Facility Providers</h3>
        {facilityProviders.map((provider, i) => {
          return (
            <div className="Provider Provider-Individual">
              <p className="name">{provider.facility_name}</p>
              <div className="label">National ID</div>
              <p className="npi">{provider.npi}</p>
              <ProviderPlans npi={provider.npi} key={i} />
            </div>
          );
        })}
      </div>
    );

    return (
      <div className="Results">
        {this.state.isFetching ? gettingResults : results}
        <div className="back-forward">
          <a className="btn btn-lg btn-danger" onClick={goBack}>Go back</a>
        </div>
      </div>
    );
  }
}
