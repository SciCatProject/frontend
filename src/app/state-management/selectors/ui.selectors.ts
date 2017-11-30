import {createSelector, Store} from '@ngrx/store';

export const getMode = (state: any) => state.root.dashboardUI.mode;
