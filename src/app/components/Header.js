import React from 'react';

import { PageContants } from '../constants/AppConstants.js';
import { AppStore } from '../stores/AppStore.js';

export default class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <span className="navbar-brand">FHIRSalamander</span>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
