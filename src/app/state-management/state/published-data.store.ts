import { PublishedData } from "@scicatproject/scicat-sdk-ts-angular";
import { GenericFilters } from "state-management/models";

export interface PublishedDataState {
  publishedData: PublishedData[];
  currentPublishedData: PublishedData | undefined;

  totalCount: number;

  filters: GenericFilters;
}

export const initialPublishedDataState: PublishedDataState = {
  publishedData: [],
  currentPublishedData: undefined,

  totalCount: 0,

  filters: {
    sortField: "createdAt desc",
    skip: 0,
    limit: 25,
  },
};
