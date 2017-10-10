import {Action} from '@ngrx/store';
import {initialJobsState, JobsState} from 'state-management/state/jobs.store';
import * as ja from 'state-management/actions/jobs.actions';

export function jobsReducer(state = initialJobsState, action: Action): JobsState {

  if (action.type.indexOf('[Jobs]') !== -1) {
    console.log('Action came in! ' + action.type);
  }
  switch (action.type) {

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

    default: {
      return state;
    }
  }
}
