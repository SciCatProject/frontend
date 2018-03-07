import { Action } from '@ngrx/store';
import { Job } from 'shared/sdk/models';

import { initialJobsState, JobsState } from 'state-management/state/jobs.store';
import {
    SORT_UPDATE,
    UI_STORE,
    SUBMIT_COMPLETE,
    FAILED,
    RETRIEVE_COMPLETE,
    CHILD_RETRIEVE_COMPLETE,
    SELECT_CURRENT,
    SEARCH_ID_COMPLETE,
} from 'state-management/actions/jobs.actions';

export function jobsReducer(state = initialJobsState, action: Action): JobsState {

    if (action.type.indexOf('[Jobs]') !== -1) {
        console.log('Action came in! ' + action.type);
    }

    switch (action.type) {
        case SORT_UPDATE: {
            const filters = action['payload'];

            // TODO: There is no field in the store called selectedSets
            return {...state, filters, loading: true/*, selectedSets: [] */};
        }

        // TODO: These replace any field in the store with values from the payload.
        // Should probably be made less destructive?
        case UI_STORE:
        case CHILD_RETRIEVE_COMPLETE: {
            const ui = action['payload'];
            return {...state, ui};
        }

        case SUBMIT_COMPLETE: {
            return {...state, jobSubmission: []};
        }

        case FAILED: {
            const error = action['payload'];
            return {...state, error, jobSubmission: []};
        }

        case RETRIEVE_COMPLETE: {
            const currentJobs = action['payload'];
            return {...state, loading: false, currentJobs};
        }

        // TODO: There is no field in the store called currentSet
        case SELECT_CURRENT: {
            const s = Object.assign({}, state, {currentSet: action['payload']});
            return s;
        }

        // TODO: There is no field in the store called currentSet
        case SEARCH_ID_COMPLETE: {
            const d = <Job>action['payload'];
            return Object.assign({}, state, { currentSet: d, loading: false });
        }

        default: {
            return state;
        }
    }
}
