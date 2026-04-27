import {
  GenericFilters,
  FilesDatasetFilter,
  FileOrigdatablock,
} from "state-management/models";

export const getFileOrigdatablockKey = (
  origDatablock: FileOrigdatablock,
): string =>
  [origDatablock.datasetId ?? "", origDatablock.dataFileList?.path ?? ""].join(
    ":",
  );

export interface FilesState {
  origDatablocks: FileOrigdatablock[];
  currentOrigDatablock: FileOrigdatablock | undefined;
  currentDatasetOrigDatablocks: FileOrigdatablock[];

  selectedOrigDatablocks: FileOrigdatablock[];

  totalCount: number;
  currentDatasetCount: number;

  selectedOrigDatablocksCount: number;

  filters: GenericFilters;

  datasetFilter: FilesDatasetFilter;
}

export const initialFilesState: FilesState = {
  origDatablocks: [],
  currentOrigDatablock: undefined,
  currentDatasetOrigDatablocks: [],
  selectedOrigDatablocks: [],

  totalCount: 0,
  currentDatasetCount: 0,
  selectedOrigDatablocksCount: 0,

  filters: {
    sortField: "createdAt desc",
    skip: 0,
    limit: 25,
  },

  datasetFilter: {
    datasetId: "",
    skip: 0,
    limit: 25,
    sortField: "createdAt desc",
  },
};
