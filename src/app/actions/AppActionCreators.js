import AppDispatcher from '../dispatcher/AppDispatcher.js';
import { ActionTypes } from '../constants/AppConstants.js';

export default {

  changePage(newPage) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_PAGE,
      newPage: newPage
    });
  },

  changeDoctorName(doctorName) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_DOCTOR_NAME,
      doctorName: doctorName
    });
  },

  changeSpecialties(specialties) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_SPECIALTIES,
      specialties: specialties
    });
  },

  changeResults(results) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_RESULTS,
      results: results
    });
  },

  changeIsFetching(isFetching) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_IS_FETCHING,
      isFetching: isFetching
    });
  }

};
