import {Action} from '@ngrx/store';
import {DashboardUIState, initialDashboardUIState} from 'state-management/state/dashboard-ui.store';
import * as dua from 'state-management/actions/dashboard-ui.actions';

export function dashboardUIReducer(state = initialDashboardUIState, action: Action): DashboardUIState {

  if (action.type.indexOf('[Dashboard]') !== -1) {
    console.log('Action came in! ' + action.type);
  }
  switch (action.type) {

    case dua.SAVE: {
      const s = Object.assign({}, state, action['payload']);
      return s;
    }

    case dua.SAVE_MODE: {
      const s = Object.assign({}, state, {'mode': action['payload']});
      return s;
    }

    default: {
      return state;
    }
  }
}
