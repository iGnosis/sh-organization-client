import { createAction, props } from '@ngrx/store';
import { DashboardState } from 'src/app/pointmotion';

export const dashboard = {
  setDateRange: createAction('[Dashboard] Set Date Range', props<DashboardState>()),
};
