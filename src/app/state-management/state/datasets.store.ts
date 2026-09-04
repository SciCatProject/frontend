import { DatasetFilters, ArchViewMode } from "state-management/models";
import {
  PartialOutputDatasetDto,
  OutputAttachmentV3Dto,
  Datablock,
  OrigDatablock,
  HistoryClass,
} from "@scicatproject/scicat-sdk-ts-angular";

export interface FacetCount {
  _id: string;
  label?: string;
  count: number;
}

export interface FacetCounts {
  [field: string]: FacetCount[];
}

export interface Pagination {
  skip: number;
  limit: number;
}

export type CurrentDataset = PartialOutputDatasetDto & {
  attachments?: OutputAttachmentV3Dto[];
  datablocks?: Datablock[];
  origdatablocks?: OrigDatablock[];
  history?: HistoryClass[];
  proposalIds?: string[];
  sampleIds?: string[];
  instrumentIds?: string[];
};

export interface DatasetState {
  datasets: PartialOutputDatasetDto[];
  selectedSets: PartialOutputDatasetDto[];
  currentSet: CurrentDataset | undefined;
  relatedDatasets: PartialOutputDatasetDto[];
  relatedDatasetsCount: number;
  totalCount: number;

  facetCounts: FacetCounts;
  facetCountsIsLoading: boolean;
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

  batch: CurrentDataset[];

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
  facetCountsIsLoading: false,
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
    sortField: "",
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
