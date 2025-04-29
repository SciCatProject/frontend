import { OrigDatablock } from "@scicatproject/scicat-sdk-ts-angular";
import { GenericFilters } from "state-management/models";

export interface FilesState {
  origDatablocks: OrigDatablock[];
  currentOrigDatablock: OrigDatablock | undefined;

  totalCount: number;

  filters: GenericFilters;
}

export const initialFilesState: FilesState = {
  origDatablocks: [],
  currentOrigDatablock: undefined,

  totalCount: 0,

  filters: {
    sortField: "createdAt desc",
    skip: 0,
    limit: 25,
  },
};
