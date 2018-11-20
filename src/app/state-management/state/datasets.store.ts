import { DatasetFilters, Dataset } from "state-management/models";

export interface DateTriple {
  year: number;
  month: number;
  day: number;
}

export interface FacetCount {
  _id?: string | DateTriple;
  count: number;
}

export interface FacetCounts {
  [field: string]: FacetCount[];
}

export interface DatasetState {
  datasets: Dataset[];
  selectedSets: Dataset[];
  currentSet: Dataset;
  facetCounts: FacetCounts;
  totalCount: number;

  datasetsLoading: boolean;
  facetCountsLoading: boolean;
  hasPrefilledFilters: boolean;

  searchTerms: string;
  keywordsTerms: string;
  filters: DatasetFilters;

  batch: Dataset[];
}

export const initialDatasetState: DatasetState = {
  datasets: [],
  selectedSets: [],
  currentSet: null,
  facetCounts: {},
  totalCount: 0,

  datasetsLoading: true,
  facetCountsLoading: true,
  hasPrefilledFilters: false,

  searchTerms: "",
  keywordsTerms: "",
  batch: [],

  filters: {
    mode: "view",
    text: "",
    creationTime: null,
    type: [],
    creationLocation: [],
    ownerGroup: [],
    skip: 0,
    limit: 30,
    sortField: "creationTime:desc",
    keywords: [],
    scientific: []
  }
};
