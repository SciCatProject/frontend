import {Action} from '@ngrx/store';
import {DashboardUIState, initialDashboardUIState} from 'state-management/state/dashboard-ui.store';

import {
    SAVE_MODE, SaveModeAction,
    SAVE, SaveAction,
} from 'state-management/actions/dashboard-ui.actions';

export function dashboardUIReducer(state = initialDashboardUIState, action: Action): DashboardUIState {

    if (action.type.indexOf('[Dashboard]') !== -1) {
        console.log('Action came in! ' + action.type);
    }
    
    switch (action.type) {
        /*
        This action replaces the whole state with the payload of the action. Is this intended?
        case SAVE: {
            return Object.assign({}, state, action['payload']);
        }*/
        case SAVE_MODE: {
            const mode = (action as SaveModeAction).payload;
            return {...state, mode};
        }
        default: {
            return state;
        }
    }
}
