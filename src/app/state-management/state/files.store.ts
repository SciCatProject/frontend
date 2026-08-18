import { GenericFilters } from "state-management/models";

export interface FilesState {
  origDatablocks: object[];
  currentOrigDatablock: object | undefined;

  totalCount: number;
  filesCountIsLoading: boolean;

  filters: GenericFilters;
}

export const initialFilesState: FilesState = {
  origDatablocks: [],
  currentOrigDatablock: undefined,

  totalCount: 0,
  filesCountIsLoading: false,

  filters: {
    sortField: "createdAt desc",
    skip: 0,
    limit: 25,
  },
};
