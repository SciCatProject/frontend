import {
  DatasetFilters,
  ArchViewMode,
  FacetCounts,
} from "state-management/models";
import {
  PartialOutputDatasetDto,
  OutputAttachmentV4Dto,
  Datablock,
  OrigDatablock,
  HistoryClass,
  Instrument,
  ProposalClass,
  OutputSampleDto,
} from "@scicatproject/scicat-sdk-ts-angular";

export interface Pagination {
  skip: number;
  limit: number;
}

export type CurrentDataset = PartialOutputDatasetDto & {
  attachments?: OutputAttachmentV4Dto[];
  datablocks?: Datablock[];
  origdatablocks?: OrigDatablock[];
  history?: HistoryClass[];
  proposals?: ProposalClass[];
  samples?: OutputSampleDto[];
  instruments?: Instrument[];
};

// `addedFrom` values for datasets added to the cart outside the dataset list
export const BATCH_ADDED_FROM_DETAILS = "details";
export const BATCH_ADDED_FROM_PUBLISHED_DATA = "publishedData";

/**
 * A dataset in the cart. `addedFrom` records where it was added from, so
 * batch actions in the cart can tell (see the default Archive/Retrieve
 * actions): the archive view mode it was selected in on the dataset list
 * (e.g. "archivable"), "details" when added from the dataset details page,
 * or "publishedData" when loaded from a publication's dataset list.
 * It is unset for datasets added before this was recorded.
 */
export type BatchDataset = CurrentDataset & {
  addedFrom?: string;
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
  origDatablocksCountIsLoading: boolean;
  relatedDatasetsCountIsLoading: boolean;
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

  batch: BatchDataset[];

  openwhiskResult: Record<string, unknown> | undefined;

  origDatablocksCount?: number;
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
  origDatablocksCountIsLoading: false,
  relatedDatasetsCountIsLoading: false,
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

  origDatablocksCount: 0,
};
