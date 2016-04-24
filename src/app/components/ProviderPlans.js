import React from 'react';

import { PageConstants } from '../constants/AppConstants.js';
import AppStore from '../stores/AppStore.js';
import AppActionCreators from '../actions/AppActionCreators.js';

const getStateFromStores = (props) => {
  return {
    isFetchingProviderPlans: AppStore.isFetchingProviderPlansForProvider(props.npi),
    providerPlans: AppStore.getProviderPlansForProvider(props.npi)
  };
};

export default class ProviderPlans extends React.Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStores(this.props);
    this._onAppStoreChanged = this._onAppStoreChanged.bind(this);
    this.handleShowPlans = this.handleShowPlans.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onAppStoreChanged);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onAppStoreChanged);
  }

  _onAppStoreChanged() {
    this.setState(getStateFromStores(this.props));
  }

  handleShowPlans() {
    AppActionCreators.changeDoctorName(event.target.value);

    let npi = this.props.npi;

    let getParams = {
      npi: npi
    };

    AppActionCreators.changeIsFetchingProviderPlans(npi, true);

    $.ajax({
      url: "/getProviderPlans",
      dataType: "json",
      type: "GET",
      data: getParams
    }).done(function(providerPlans) {
      AppActionCreators.changeProviderPlans(npi, providerPlans);
    });
  }

  render() {
    var element;

    if(this.state.providerPlans) {
      element = (
        <div>
          <h4>Provider Plans</h4>
          {this.state.providerPlans.map((providerPlan, i) => {
            return (
              <div className="ProviderPlans-list">
                <div className="name">{providerPlan.marketing_name}</div>
                <div><a href={providerPlan.summary_url}>Summary URL</a></div>
                <div className="label">Plan ID</div>
                <div className="planId">{providerPlan.plan_id}</div>
              </div>
            );
          })}
        </div>
      );
    } else if(this.state.isFetchingProviderPlans) {
      element = (<p>Getting results...</p>);
    } else {
      element = (<button className="btn" onClick={this.handleShowPlans}>View Plans</button>);
    }

    return (
      <div className="ProviderPlans">
        {element}
      </div>
    );
  }
}
