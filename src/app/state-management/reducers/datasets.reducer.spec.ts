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
	  expect(state.datasetsLoading).toEqual(false);
    });
  });

  // group tests under the reducer's name

  describe('filter value action', () => {
    it('should return the state loading', () => {
	  const payload = [{'check':'2'}];
      const action = new fromActions.FilterValueAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
	  expect(state.filtersLoading).toEqual(false);
    });
  });


});
