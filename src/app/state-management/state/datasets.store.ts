import { DatasetClass } from "@scicatproject/scicat-sdk-ts-angular";
import { DatasetFilters, ArchViewMode } from "state-management/models";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";

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

export interface Pagination {
  skip: number;
  limit: number;
}

export interface DatasetState {
  datasets: OutputDatasetObsoleteDto[];
  selectedSets: OutputDatasetObsoleteDto[];
  currentSet: OutputDatasetObsoleteDto | undefined;
  relatedDatasets: OutputDatasetObsoleteDto[];
  relatedDatasetsCount: number;
  totalCount: number;

  facetCounts: FacetCounts;
  metadataKeys: string[];
  hasPrefilledFilters: boolean;
  searchTerms: string;
  keywordsTerms: string;
  pidTerms: string;
  filters: DatasetFilters;
  pagination: Pagination;

  relatedDatasetsFilters: {
    skip: number;
    limit: number;
    sortField: string;
  };

  batch: OutputDatasetObsoleteDto[];

  openwhiskResult: Record<string, unknown> | undefined;
}

export const initialDatasetState: DatasetState = {
  datasets: [],
  selectedSets: [],
  currentSet: undefined,
  relatedDatasets: [],
  relatedDatasetsCount: 0,
  totalCount: 0,

  facetCounts: {},
  metadataKeys: [],
  hasPrefilledFilters: false,
  searchTerms: "",
  keywordsTerms: "",
  pidTerms: "",
  filters: {
    modeToggle: ArchViewMode.all,
    mode: {},
    text: "",
    creationTime: null,
    type: [],
    creationLocation: [],
    ownerGroup: [],
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc",
    keywords: [],
    scientific: [],
    isPublished: "",
    pid: "",
  },
  pagination: {
    skip: 0,
    limit: 25,
  },
  relatedDatasetsFilters: {
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc",
  },

  batch: [],

  openwhiskResult: undefined,
};
