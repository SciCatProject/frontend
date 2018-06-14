import { Action } from '@ngrx/store';
import * as fromDatasets from './datasets.reducer';
import * as fromActions from '../actions/datasets.actions';
import { Dataset, AccessGroup, Datablock, DatasetInterface } from 'shared/sdk/models';
import { DatasetState, initialDatasetState } from 'state-management/state/datasets.store';
import { DatasetFilters } from '../models';


describe('DatasetsReducer', () => {

    it('should set datasetsLoading to true after fetch complete', () => {
        const action = new fromActions.FetchDatasetsAction();
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.datasetsLoading).toEqual(true);
    })
    it('should have the correct number of datasets after fetch datasets complete', () => {
        const data: DatasetInterface = {
            owner: '',
            contactEmail: '',
            sourceFolder: '',
            creationTime: new Date(),
            type: '',
            ownerGroup: '',
        };
        const datasets = [
            new Dataset({ pid: 'pid 1', ...data }),
            new Dataset({ pid: 'pid 2', ...data }),
            new Dataset({ pid: 'pid 3', ...data })
        ];
        const action = new fromActions.FetchDatasetsCompleteAction(datasets);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const ids = Object.keys(state.datasets);
        expect(ids.length).toEqual(3);

    })
    it('should set datasetsLoading to false after fetch datasets complete complete', () => {
        const data: DatasetInterface = {
            owner: '',
            contactEmail: '',
            sourceFolder: '',
            creationTime: new Date(),
            type: '',
            ownerGroup: '',
        };

        const datasets = [
            new Dataset({ pid: 'pid 1', ...data }),
            new Dataset({ pid: 'pid 2', ...data }),
            new Dataset({ pid: 'pid 3', ...data })
        ];
        const action = new fromActions.FetchDatasetsCompleteAction(datasets);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.datasetsLoading).toEqual(false);
    })
    it('should set datasetsLoading to false after fetch datasets failed complete', () => {
        const action = new fromActions.FetchDatasetsFailedAction();
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.datasetsLoading).toEqual(false);
    })
    it('should set facetCountsLoading to true after fetch facet counts complete', () => {
        const action = new fromActions.FetchFacetCountsAction();
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.facetCountsLoading).toEqual(true);
    })
    it('should set facetCountsLoading to false after fetch facet counts failed complete', () => {
        const action = new fromActions.FetchFacetCountsFailedAction();
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.facetCountsLoading).toEqual(false);
    })

    it('should set datasetsLoading to true after filter update complete', () => {
        const x = [];
        const action = new fromActions.UpdateFilterAction(x);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.datasetsLoading).toEqual(true);
    })
    it('should set filters', () => {
        const filter: DatasetFilters = {
            text: '',
            ownerGroup: [],
            type: [],
            creationTime: { begin: new Date(2018, 1, 1).toISOString(), end: new Date(2018, 1, 2).toISOString() },
            creationLocation: [],
            skip: 0,
            limit: 0,
            keywords: [],
            sortField: '',
            mode: 'view',
        };
        const action = new fromActions.UpdateFilterAction(filter);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.filters).toEqual(filter);
    })
    it('should set selectedSets to an empty array', () => {
        const filter: DatasetFilters = {
            text: '',
            ownerGroup: [],
            type: [],
            creationTime: { begin: new Date(2018, 1, 1).toISOString(), end: new Date(2018, 1, 2).toISOString() },
            creationLocation: [],
            skip: 0,
            limit: 0,
            keywords: [],
            sortField: '',
            mode: 'view',
        };
        const action = new fromActions.UpdateFilterAction(filter);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.selectedSets.length).toEqual(0);
    })
    it('should set hasPrefilledFilters to true after prefil filter complete', () => {
        const data = {};
        const action = new fromActions.PrefillFiltersAction(data);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.hasPrefilledFilters).toEqual(true);
    })
    it('should set filters', () => {
        const filter: DatasetFilters = {
            text: '',
            ownerGroup: [],
            type: [],
            creationTime: { begin: new Date(2018, 1, 1).toISOString(), end: new Date(2018, 1, 2).toISOString() },
            creationLocation: [],
            skip: 0,
            limit: 0,
            keywords: [],
            sortField: '',
            mode: 'view',
        };
        const action = new fromActions.PrefillFiltersAction(filter);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.filters).toEqual(filter);
    })

    it('should set searchterms', () => {
        const filter: DatasetFilters = {
            text: 'abc',
            ownerGroup: [],
            type: [],
            creationTime: { begin: new Date(2018, 1, 1).toISOString(), end: new Date(2018, 1, 2).toISOString() },
            creationLocation: [],
            skip: 0,
            limit: 0,
            keywords: [],
            sortField: '',
            mode: 'view',
        };
        const action = new fromActions.PrefillFiltersAction(filter);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.searchTerms).toEqual(filter.text);
    })
    it('should set searchterm', () => {
        const term = 'abc';
        const action = new fromActions.SetSearchTermsAction(term);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.searchTerms).toEqual(term);
    })
    it('should set filters location', () => {
        const location = 'Lund';
        const action = new fromActions.AddLocationFilterAction(location);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const str = state.filters.creationLocation;
        expect(str).toContain(location);
    })
    it('should remove filters location', () => {
        const location = 'Lund';

        const action = new fromActions.RemoveLocationFilterAction(location);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const str = state.filters.creationLocation;
        expect(str).not.toContain(location);
    })
    it('should set filters ownergroup', () => {
        const group = 'MAX IV';
        const action = new fromActions.AddGroupFilterAction(group);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const str = state.filters.ownerGroup;
        expect(str).toContain(group);
    })
    it('should remove filters ownergroup', () => {
        const group = 'MAX IV';
        const action = new fromActions.RemoveGroupFilterAction(group);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const str = state.filters.ownerGroup;
        expect(str).not.toContain(group);
    })
    it('should set filters type', () => {
        const type = 'a';
        const action = new fromActions.AddTypeFilterAction(type);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const str = state.filters.type;
        expect(str).toContain(type);
    })
    it('should remove filters type', () => {
        const type = 'a';
        const action = new fromActions.RemoveTypeFilterAction(type);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const str = state.filters.type;
        expect(str).not.toContain(type);
    })
    it('should set filters text', () => {
        const text = 'efg'
        const action = new fromActions.SetTextFilterAction(text);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.filters.text).toEqual(text);
    })
    it('should set filters keyword', () => {
        const keyword = '111';
        const action = new fromActions.AddKeywordFilterAction(keyword);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const str = state.filters.keywords;
        expect(str).toContain(keyword);
    })
    it('should set filters creationTime', () => {
        const begin = new Date(2018, 1, 2).toISOString();
        const end = new Date(2018, 1, 3).toISOString();
        const filter: DatasetFilters = {
            text: '',
            ownerGroup: [],
            type: [],
            creationTime: { begin, end },
            creationLocation: [],
            skip: 0,
            limit: 0,
            keywords: [],
            sortField: '',
            mode: 'view',
        };
        const action = new fromActions.SetDateRangeFilterAction(begin, end);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.filters.creationTime).toEqual(filter.creationTime)
    })
    it('should remove filters keyword', () => {
        const keyword = '111';
        const action = new fromActions.RemoveKeywordFilterAction(keyword);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const str = state.filters.keywords;
        expect(str).not.toContain(keyword);
    })
    it('should save the filters limit, clear the state and aply the old limit with clear facet complete', () => { 
        const limit = 10;
        const page = 1;
        const act = new fromActions.ChangePageAction(page, limit);
        const sta = fromDatasets.datasetsReducer(initialDatasetState, act);
        const action = new fromActions.ClearFacetsAction();
        const state = fromDatasets.datasetsReducer(sta, action);
        expect(state.filters.limit).toEqual(limit);
    })
    it('should set searchterm to an empty string', () => {
        const action = new fromActions.ClearFacetsAction();
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.searchTerms).toEqual('');
    })
    it('should set datasetsLoading to true after change paige complete', () => {
        const limit = 10;
        const page = 20;
        const action = new fromActions.ChangePageAction(page, limit);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.datasetsLoading).toEqual(true);
    })


    it('should set filters sortField', () => {
        const column = '123';
        const direction = '456';
        const filter: DatasetFilters = {
            text: '',
            ownerGroup: [],
            type: [],
            creationTime: { begin: new Date(2018, 1, 1).toISOString(), end: new Date(2018, 1, 2).toISOString() },
            creationLocation: [],
            skip: 0,
            limit: 0,
            keywords: [],
            sortField: column + (direction ? ':' + direction : ''),
            mode: 'view',
        };
        const action = new fromActions.SortByColumnAction(column, direction);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.filters.sortField).toEqual(filter.sortField);
    })

    describe('SearchCompleteAction', () => {
        it('should set datasetsLoading to false after search complete', () => {
            const payload = [{ 'id': '1' }];
            const action = new fromActions.SearchCompleteAction(payload);
            const state = fromDatasets.datasetsReducer(initialDatasetState, action);
            expect(state.datasetsLoading).toEqual(false);

        });
    });

    it('should set datasets ', () => {
        const data: DatasetInterface = {
            owner: '',
            contactEmail: '',
            sourceFolder: '',
            creationTime: new Date(),
            type: '',
            ownerGroup: '',
        };

        const datasets = [
            new Dataset({ pid: 'pid 1', ...data }),
            new Dataset({ pid: 'pid 2', ...data }),
            new Dataset({ pid: 'pid 3', ...data })
        ];
        const action = new fromActions.SearchCompleteAction(datasets);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const sets = Object.keys(state.datasets);
        expect(sets.length).toEqual(3);
    })

    describe('SearchFailedAction', () => {
        it('should set hasPrefilledFilters to false after search fialed complete', () => {
            const payload = [{ 'id': '1' }];
            const action = new fromActions.SearchFailedAction(payload);
            const state = fromDatasets.datasetsReducer(initialDatasetState, action);
            expect(state.hasPrefilledFilters).toEqual(false);

        });
    });
    it('shoud set facetCountsLoading to false after filter update complete', () => {
        const filter: DatasetFilters = {
            text: '',
            ownerGroup: [],
            type: [],
            creationTime: { begin: new Date(2018, 1, 1).toISOString(), end: new Date(2018, 1, 2).toISOString() },
            creationLocation: [],
            skip: 0,
            limit: 0,
            keywords: [],
            sortField: '',
            mode: 'view',
        };
        const action = new fromActions.UpdateFilterCompleteAction(filter);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.facetCountsLoading).toEqual(false);
    })
    it('shoud set filters', () => {
        const filter: DatasetFilters = {
            text: '',
            ownerGroup: [],
            type: [],
            creationTime: { begin: new Date(2018, 1, 1).toISOString(), end: new Date(2018, 1, 2).toISOString() },
            creationLocation: [],
            skip: 0,
            limit: 0,
            keywords: [],
            sortField: '',
            mode: 'view',
        };
        const action = new fromActions.UpdateFilterCompleteAction(filter);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        expect(state.filters).toEqual(filter);
    })
    it('should set selectedSets ', () => {
        const data: DatasetInterface = {
            owner: '',
            contactEmail: '',
            sourceFolder: '',
            creationTime: new Date(),
            type: '',
            ownerGroup: '',
        };

        const datasets = [
            new Dataset({ pid: 'pid 1', ...data }),
            new Dataset({ pid: 'pid 2', ...data }),
            new Dataset({ pid: 'pid 3', ...data })
        ];
        const action = new fromActions.UpdateSelectedAction(datasets);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const sets = Object.keys(state.selectedSets);
        expect(sets.length).toEqual(3);
    })

    it('should set selectedSets ', () => {
        const data: DatasetInterface = {
            owner: '',
            contactEmail: '',
            sourceFolder: '',
            creationTime: new Date(),
            type: '',
            ownerGroup: '',
        };

        const datasets = [
            new Dataset({ pid: 'pid 1', ...data }),
            new Dataset({ pid: 'pid 2', ...data }),
            new Dataset({ pid: 'pid 3', ...data })
        ];
        const action = new fromActions.UpdateSelectedDatablocksAction(datasets);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
        const sets = Object.keys(state.selectedSets);
        expect(sets.length).toEqual(3);
    })


    it('should set currentSet ', () => {
        const data: DatasetInterface = {
			owner: '',
			contactEmail: '',
			sourceFolder: '',
			creationTime: new Date(),
			type: '',
			ownerGroup: '',
		};

		const dataset = new Dataset({pid: 'pid 1', ...data});
        const action = new fromActions.SearchIDCompleteAction(dataset);
        const state = fromDatasets.datasetsReducer(initialDatasetState, action);
		expect(state.currentSet).toEqual(dataset);
    })


    describe('CurrentSetAction', () => { 
        it('should set currenSet', () => {
            const data: DatasetInterface = {
                owner: '',
                contactEmail: '',
                sourceFolder: '',
                creationTime: new Date(),
                type: '',
                ownerGroup: '',
            };
    
            const dataset = new Dataset({pid: 'pid 1', ...data});
            const action = new fromActions.CurrentSetAction(dataset);
            const state = fromDatasets.datasetsReducer(initialDatasetState, action);
            expect(state.currentSet).toEqual(dataset);

        });
    });


    describe('UpdateCurrentBlocksAction', () => { 
        it('should set currentSet', () => {
            const data: DatasetInterface = {
                owner: '',
                contactEmail: '',
                sourceFolder: '',
                creationTime: new Date(),
                type: '',
                ownerGroup: '',
            };
    
            const dataset = new Dataset({pid: 'pid 1', ...data});
            const action = new fromActions.UpdateCurrentBlocksAction(dataset);
            const state = fromDatasets.datasetsReducer(initialDatasetState, action);
            expect(state.currentSet).toEqual(dataset);

        });
    });


    describe('ChangePageAction', () => {
        it('should set filters limit and skip', () => {
            const page = 1;
            const limit = 1;
            const skip= page * limit;
            const action = new fromActions.ChangePageAction(page, limit);
            const state = fromDatasets.datasetsReducer(initialDatasetState, action);
            expect(state.filters.limit).toEqual(limit);
            expect(state.filters.skip).toEqual(skip);
        });
    });


    describe('SelectDatasetAction', () => { 
        it('should check if data is selected in selectedSets', () => {
            const data: DatasetInterface = { owner: '', contactEmail: '', sourceFolder: '', creationTime: new Date(), type: '', ownerGroup: '' };
            const payload = new Dataset({ pid: 'pid 1', ...data });
            const action = new fromActions.SelectDatasetAction(payload);
            const state = fromDatasets.datasetsReducer(initialDatasetState, action);
            expect(state.selectedSets).toEqual([payload]);
        });
    });


    describe('DeselectDatasetAction', () => {
        it('should check that data is not in selectedSets', () => {
            const data: DatasetInterface = { owner: '', contactEmail: '', sourceFolder: '', creationTime: new Date(), type: '', ownerGroup: '' };
            const payload = new Dataset({ pid: 'pid 1', ...data });
            const action = new fromActions.DeselectDatasetAction(payload);
            const state = fromDatasets.datasetsReducer(initialDatasetState, action);
            expect(state.selectedSets).not.toEqual([payload]);
        });
    });


    describe('ClearSelectionAction', () => {
        it('should set selectedSets to an empty array', () => {
            const payload = [{ 'id': '1' }];
            const action = new fromActions.ClearSelectionAction();
            const state = fromDatasets.datasetsReducer(initialDatasetState, action);
            expect(state.selectedSets).toEqual([]);
        });
    });




    describe('SortByColumnAction', () => {
        it('should set datasetsLoading to true after sort by column complete', () => {
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
            expect(state.filters.mode).toEqual(mode);
        });
    });
});

