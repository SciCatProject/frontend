import {Action} from '@ngrx/store';
import * as lb from 'shared/sdk/models';
import {initialJobsState, JobsState} from 'state-management/state/jobs.store';
import * as ja from 'state-management/actions/jobs.actions';

export function jobsReducer(state = initialJobsState, action: Action): JobsState {

  if (action.type.indexOf('[Jobs]') !== -1) {
    console.log('Action came in! ' + action.type);
  }
  switch (action.type) {

    case ja.SORT_UPDATE: {
      let f = action['payload'];
      const newState = Object.assign({}, state, { activeFilters: f, loading: true, selectedSets: [] });
      return newState;
    }

    case ja.UI_STORE: {
      const s = Object.assign({}, state, {ui: action['payload']});
      return s;
    }

    case ja.SUBMIT_COMPLETE: {
      const s = Object.assign({}, state, {jobSubmission: []});
      return s;
   }

    case ja.RETRIEVE_COMPLETE: {
      const s = Object.assign({}, state, {currentJobs: action['payload']});
      return s;
    }

    case ja.CHILD_RETRIEVE_COMPLETE: {
      const s = Object.assign({}, state, {ui: action['payload']});
      return s;
    }


    case ja.SELECT_CURRENT: {
      const s = Object.assign({}, state, {currentSet:  action['payload']});
      return s;
    }


    case ja.SEARCH_ID_COMPLETE: {
      const d = <lb.Job[]>action['payload'];
      return Object.assign({}, state, { datasets: d, loading: false });
    }

    default: {
      return state;
    }
  }
}
