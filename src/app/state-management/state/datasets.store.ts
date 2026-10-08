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
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";

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

  batch: CurrentDataset[];

  openwhiskResult: Record<string, unknown> | undefined;

  origDatablocksCount?: number;
  datafilesColumns?: TableField<any>[];
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
  datafilesColumns: [
    {
      name: "path",
      header: "Path",
    },
    {
      name: "size",
      header: "Size",
      pipe: "filesize",
    },
    {
      name: "time",
      header: "Time",
      type: "date",
      format: "yyyy-MM-dd HH:mm",
    },
  ],
};
