import * as lb from 'shared/sdk/models';
import { DatasetFilters } from 'state-management/models';

// NOTE It IS ok to make up a state of other sub states
export interface DatasetState {
    datasets: lb.Dataset[];
    loading: boolean;
    activeFilters: DatasetFilters;
    filterValues: object;
    currentSet: lb.Dataset;
    selectedSets: lb.Dataset[];
    totalSets: number;
}

export const initialDatasetState: DatasetState = {
    datasets: [],
    loading: false,
    activeFilters: <DatasetFilters>{ text: null, creationTime: null, type: null,
      creationLocation: [], ownerGroup: [], skip: 0, initial: true, sortField: 'creationTime desc', keywords: []},
    filterValues: {creationTime: {start: null, end: null}, creationLocation: [], ownerGroup: [], text: null, type: null, keywords: []},
    selectedSets: [],
    currentSet: undefined,
    totalSets: 0
};
