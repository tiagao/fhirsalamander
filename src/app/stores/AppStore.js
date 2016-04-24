import { EventEmitter } from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher.js';
import { ActionTypes, PageConstants } from '../constants/AppConstants.js';

const CHANGE_EVENT = 'change';

const _appState = {
  page: PageConstants.INTRO,
  doctorName: '',
  specialties: [],
  results: [],
  isFetching: false
};

const AppStore = Object.assign({}, EventEmitter.prototype, {

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getPage() {
    return _appState.page;
  },

  getDoctorName() {
    return _appState.doctorName;
  },

  getSpecialties() {
    return _appState.specialties;
  },

  getResults() {
    return _appState.results;
  },

  isFetching() {
    return _appState.isFetching;
  }

});

AppStore.dispatchToken = AppDispatcher.register((action) => {

  switch(action.type) {

    case ActionTypes.CHANGE_PAGE:
      _appState.page = action.newPage;
      AppStore.emitChange();
      break;

    case ActionTypes.CHANGE_DOCTOR_NAME:
      _appState.doctorName = action.doctorName;
      AppStore.emitChange();
      break;

    case ActionTypes.CHANGE_SPECIALTIES:
      _appState.specialties = action.specialties;
      AppStore.emitChange();
      break;

    case ActionTypes.CHANGE_RESULTS:
      _appState.results = action.results;
      _appState.isFetching = false;
      AppStore.emitChange();
      break;

    case ActionTypes.CHANGE_IS_FETCHING:
      _appState.isFetching = action.isFetching;
      AppStore.emitChange();
      break;

  }

});

export default AppStore;
