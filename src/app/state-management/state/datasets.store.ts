import * as lb from 'shared/sdk/models';
import {DatasetFilters} from 'datasets/datasets-filter/dataset-filters';
import {DatepickerState, initialDatepickerState} from 'shared/modules/datepicker/datepicker.store';

// NOTE It IS ok to make up a state of other sub states
export interface DatasetState {
    datasets: lb.RawDataset[];
    loading: boolean;
    activeFilters: DatasetFilters;
    filterValues: object;
    currentSet: lb.RawDataset;
    selectedSets: lb.RawDataset[];
    totalSets: number;
    datepicker: DatepickerState;
}

export const initialDatasetState: DatasetState = {
    datasets: [],
    loading: false,
    activeFilters: <DatasetFilters>{ text: null, creationTime: null,
      creationLocation: null, ownerGroup: [], skip: 0, initial: true, sortField: null},
    filterValues: {creationTime: {start: null, end: null}, creationLocation: [], ownerGroup: [], text: null},
    selectedSets: [],
    currentSet: undefined,
    totalSets: 100,
    datepicker: initialDatepickerState
};
