import { Action } from '@ngrx/store';
import * as fromDatasets from './datasets.reducer';
import * as fromActions from '../actions/datasets.actions';
import { Dataset } from 'shared/sdk/models';
import { DatasetState, initialDatasetState } from 'state-management/state/datasets.store';

describe('DatasetsReducer', () => {
  describe('search complete action', () => {
    it('should return the state loading', () => {
	  const payload = [new Dataset()];
      const action = new fromActions.SearchCompleteAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

	  expect(state.loading).toEqual(false);

    });
  });
  // I nest all tests under the reducer's name 
  // for readability in the terminal
});
