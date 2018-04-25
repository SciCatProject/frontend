import { DatasetFilters, Dataset } from 'state-management/models';

// NOTE It IS ok to make up a state of other sub states
export interface DatasetState {
    datasets: Dataset[];
    loading: boolean;
    activeFilters: DatasetFilters;
    filterValues: object;
    currentSet: Dataset;
    selectedSets: Dataset[];
    totalSets: number;

    selectedSets2: Dataset[];
    currentPage2: number;
    itemsPerPage2: number;
}

export const initialDatasetState: DatasetState = {
    datasets: [],
    loading: false,
    activeFilters: <DatasetFilters>{ text: null, creationTime: null, type: null,
      creationLocation: [], ownerGroup: [], skip: 0, initial: true, sortField: 'creationTime desc', keywords: []},
    filterValues: {creationTime: {start: null, end: null}, creationLocation: [], ownerGroup: [], text: null, type: null, keywords: []},
    selectedSets: [],
    currentSet: undefined,
    totalSets: 0,

    selectedSets2: [],
    currentPage2: 0,
    itemsPerPage2: 30,
};
