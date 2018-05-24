import { DatasetFilters, Dataset } from 'state-management/models';

export type ViewMode = 'view' | 'archive' | 'retrieve';

export type DateTriple = {year: number, month: number, day: number};

export type FacetCount = {
    _id?: string | DateTriple;
    count: number;
};

export type FacetCounts = {
    [field: string]: FacetCount[],
};

export interface DatasetState {
    datasets: Dataset[];
    selectedSets: Dataset[];
    currentSet: Dataset;
    facetCounts: FacetCounts;
    totalCount: number;

    datasetsLoading: boolean;
    facetCountsLoading: boolean;
    
    searchTerms: string;
    mode: ViewMode;

    filters: DatasetFilters; 
}

export const initialDatasetState: DatasetState = {
    datasets: [],
    selectedSets: [],
    currentSet: null,
    facetCounts: {},
    totalCount: 0,

    datasetsLoading: true,
    facetCountsLoading: true,
    
    searchTerms: '',
    mode: 'view',
    
    filters: {
        text: null,
        creationTime: null,
        type: null,
        creationLocation: [],
        ownerGroup: [],
        skip: 0,
        limit: 30,
        initial: true,
        sortField: 'creationTime:desc',
        keywords: []
    },
};
