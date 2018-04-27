import { DatasetFilters, Dataset } from 'state-management/models';

export type ViewMode = 'view' | 'archive' | 'retrieve';

export interface DatasetState {
    datasets: Dataset[];
    loading: boolean;
    activeFilters: DatasetFilters; 
    filterValues: object; // Change to DatasetFilters, modify type with optional fields if needed
    currentSet: Dataset;
    selectedSets: Dataset[];
    totalSets: number;

    mode: ViewMode;
    selectedSets2: Dataset[];
    currentPage2: number;
    itemsPerPage2: number;
}

export const initialDatasetState: DatasetState = {
    datasets: [],
    loading: false,
    activeFilters: {
        text: null,
        creationTime: null,
        type: null,
        creationLocation: [],
        ownerGroup: [],
        skip: 0,
        initial: true,
        sortField: 'creationTime desc',
        keywords: []
    },
    filterValues: {
        creationTime: {start: null, end: null},
        creationLocation: [],
        ownerGroup: [],
        text: null,
        type: null,
        keywords: []
    },
    selectedSets: [],
    currentSet: undefined,
    totalSets: 0,

    mode: 'view',
    selectedSets2: [],
    currentPage2: 0,
    itemsPerPage2: 30,
};

/* Salvaged from obsolete Dashboard UI state:

export interface DashboardUIState {
    dsTable: Array<Dataset>;
    groupText: any;
    dateChoice: any;
    mode: string;
    darkTheme: boolean;
}

export const initialDashboardUIState: DashboardUIState = {
    dsTable: [],
    groupText: undefined,
    dateChoice: [],
    mode: 'view',
    darkTheme: true
};

*/
