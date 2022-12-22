import { createReducer, on } from '@ngrx/store';
import { DashboardState } from 'src/app/pointmotion';
import { dashboard } from '../actions/dashboard.actions';

const getInitialDateRange = () => {
  const dateRange = sessionStorage.getItem('dateRange');
  if (dateRange) {
    return parseInt(dateRange, 10);
  }
  return 7;
};

const initialState: DashboardState = {
  dateRange: getInitialDateRange(),
};

const _dashboardReducer = createReducer(
  initialState,
  on(dashboard.setDateRange, (state, data) => {
    const { dateRange } = data;
    sessionStorage.setItem('dateRange', dateRange.toString());

    return {
      ...state,
      dateRange,
    };
  }),
);

export function dashboardReducer(state: any, action: any) {
  return _dashboardReducer(state, action);
}
