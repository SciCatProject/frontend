import { Action } from '@ngrx/store';
import * as fromDatasets from './datasets.reducer';
import * as fromActions from '../actions/datasets.actions';
import { Dataset } from 'shared/sdk/models';
import { DatasetState, initialDatasetState } from 'state-management/state/datasets.store';

describe('DatasetsReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = new fromActions.SearchCompleteAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

	  expect(state.loading).toEqual(true);

    });
  });
  // I nest all tests under the reducer's name 
  // for readability in the terminal
});
