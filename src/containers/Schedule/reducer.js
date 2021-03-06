import { fromJS } from 'immutable';
import moment from 'moment';

import {
  findCurrentSchedule,
  insertIntoSchedule
} from 'helpers/schedule';
import {
  generateCalendar,
  fillCalendar,
  insertIntoCalendar
} from 'helpers/calendar';

import { actionTypes as at } from './constants';

const initialState = fromJS({
  schedule: [],
  currentScheduleDate: moment(),
  currentSchedule: {
    date: moment(),
    payload: {}
  },
  calendar: generateCalendar(),
  isLoading: false,
  isFetched: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case at.SCHEDULE_FETCH:
      return state
        .set('isLoading', true)
        .set('isFetched', false);
    case at.SCHEDULE_FETCH_SUCCESS:
      return state
        .set('isLoading', false)
        .set('isFetched', true)
        .set('schedule', fromJS(action.payload))
        .set('calendar', fillCalendar(generateCalendar(), action.payload));
    case at.SCHEDULE_FETCH_ERROR:
      return state
        .set('isLoading', false)
        .set('isFetched', false)
        .set('schedule', initialState.get('schedule'));
    case at.SCHEDULE_SET_CURRENT:
      return state
        .set('currentSchedule', fromJS(action.payload));
    case at.SCHEDULE_SAVE_CURRENT:
      return state
        .set('schedule', insertIntoSchedule(state.get('schedule'), state.get('currentSchedule')))
        .set('calendar', insertIntoCalendar(state.get('calendar'), state.get('currentSchedule')));
    case at.SCHEDULE_DATE_UPDATE:
      return state
        .set('currentScheduleDate', action.payload)
        .set('currentSchedule', findCurrentSchedule(state.get('schedule'), action.payload));
    default:
      return state;
  }
};
