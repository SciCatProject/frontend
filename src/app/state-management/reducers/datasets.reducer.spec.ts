import {Action} from '@ngrx/store';
import * as fromDatasets from './datasets.reducer';
import * as fromActions from '../actions/datasets.actions';
import {Dataset, AccessGroup, Datablock, DatasetInterface} from 'shared/sdk/models';
import {DatasetState, initialDatasetState} from 'state-management/state/datasets.store';
import {ViewMode} from '../state/datasets.store';


describe('DatasetsReducer', () => {


  describe('SearchCompleteAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.SearchCompleteAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.datasetsLoading).toEqual(false);

    });
  });


  describe('SearchFailedAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.SearchFailedAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('UpdateFilterAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.UpdateFilterAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('UpdateFilterCompleteAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.UpdateFilterCompleteAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);
    });
  });


  describe('FilterFailedAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.FilterFailedAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('FilterValueAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.FilterValueAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('SearchIDAction', () => {
    it('should return the state', () => {
      const payload = 'string';
      const action = new fromActions.SearchIDAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('SearchIDCompleteAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.SearchIDCompleteAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      //expect( state.currentSet instanceof Dataset).toBeTruthy();

    });
  });


  describe('SearchIDFailedAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.SearchIDFailedAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('DatablocksAction', () => {
    it('should return the state', () => {
      const payload = 'string';
      const action = new fromActions.DatablocksAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('DatablocksCompleteAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.DatablocksCompleteAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('DatablocksFailedAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.DatablocksFailedAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('DatablockDeleteAction', () => {
    it('should return the state', () => {
      const payload = new Datablock();
      const action = new fromActions.DatablockDeleteAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('DatablockDeleteCompleteAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.DatablockDeleteCompleteAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('DatablockDeleteFailedAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.DatablockDeleteFailedAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('AddGroupsAction', () => {
    it('should return the state', () => {
      const payload = 'string';
      const action = new fromActions.AddGroupsAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('AddGroupsCompleteAction', () => {
    it('should return the state', () => {
      const payload = [new AccessGroup()];
      const action = new fromActions.AddGroupsCompleteAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('AddGroupsFailedAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.AddGroupsFailedAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('UpdateSelectedAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.UpdateSelectedAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('UpdateSelectedDatablocksAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.UpdateSelectedDatablocksAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('CurrentSetAction', () => {
    it('should return the state', () => {
      const payload = new Dataset();
      const action = new fromActions.CurrentSetAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('UpdateCurrentBlocksAction', () => {
    it('should return the state', () => {
      const payload = new Dataset();
      const action = new fromActions.UpdateCurrentBlocksAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.currentSet).toEqual(payload);
      expect(state.currentSet instanceof Dataset).toBeTruthy();

    });
  });


  describe('ResetStatusAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.ResetStatusAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });


  describe('ResetStatusCompleteAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.ResetStatusCompleteAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.filtersLoading).toEqual(false);

    });
  });

  describe('ChangePageAction', () => {
    it('should return the state', () => {
      const page = 1;
      const limit = 1;
      const action = new fromActions.ChangePageAction(page, limit);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.currentPage2).toEqual(page);
    });
  });


  describe('TotalSetsAction', () => {
    it('should return the state', () => {
      const payload = 3;
      const action = new fromActions.TotalSetsAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.totalSets).toEqual(3);

    });
  });


  describe('SelectDatasetAction', () => {
    it('should return the state', () => {
      const data:DatasetInterface = {owner: '', contactEmail: '', sourceFolder: '', creationTime: new Date(), type: '', ownerGroup: ''};
      const payload = new Dataset({pid: 'pid 1', ...data});
      const action = new fromActions.SelectDatasetAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.selectedSets2).toEqual([payload]);
      expect(state.selectedSets2.constructor).toBe(Array);
    });
  });


  describe('DeselectDatasetAction', () => {
    it('should return the state', () => {
      const data:DatasetInterface = {owner: '', contactEmail: '', sourceFolder: '', creationTime: new Date(), type: '', ownerGroup: ''};
      const payload = new Dataset({pid: 'pid 1', ...data});
      const action = new fromActions.DeselectDatasetAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.selectedSets2).not.toEqual([payload]);
      expect(state.selectedSets2.constructor).toBe(Array);
    });
  });


  describe('ClearSelectionAction', () => {
    it('should return the state', () => {
      const payload = [{'id': '1'}];
      const action = new fromActions.ClearSelectionAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.selectedSets2).toEqual([]);
    });
  });




  describe('SortByColumnAction', () => {
    it('should return the state', () => {
      const column = "3";
      const direction = "1";
      const action = new fromActions.SortByColumnAction(column, direction);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.datasetsLoading).toEqual(true);

    });
  });


  describe('SetViewModeAction', () => {
    it('should return the state', () => {
      const mode = 'view';
      const action = new fromActions.SetViewModeAction(mode);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state).toEqual(initialDatasetState);
    });
  });
});
