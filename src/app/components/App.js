import React from 'react';

import { PageConstants } from '../constants/AppConstants.js';
import AppStore from '../stores/AppStore.js';

import Header from '../components/Header.js';
import Intro from '../components/Intro.js';
import Doctor from '../components/Doctor.js';
import Specialties from '../components/Specialties.js';
import Results from '../components/Results.js';

const getStateFromStores = () => {
  return {
    page: AppStore.getPage()
  };
};

export default class App extends React.Component {
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

  render() {
    let currentPage = AppStore.getPage();

    switch(this.state.page) {
      case PageConstants.INTRO:
        currentPage = <Intro />;
        break;
      case PageConstants.DOCTOR:
        currentPage = <Doctor />;
        break;
      case PageConstants.SPECIALTIES:
        currentPage = <Specialties />;
        break;
      case PageConstants.RESULTS:
        currentPage = <Results />;
        break;
      default:
        currentPage = <Intro />;
    }

    return (
      <div className="App container">
        <Header />
        {currentPage}
      </div>
    );
  }
}
