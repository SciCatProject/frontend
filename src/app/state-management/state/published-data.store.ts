import { PublishedData, PublishedDataFilters } from "state-management/models";

export interface PublishedDataState {
  publishedData: PublishedData[];
  currentPublishedData: PublishedData;

  totalCount: number;

  filters: PublishedDataFilters;
}

export const initialPublishedDataState: PublishedDataState = {
  publishedData: [],
  currentPublishedData: null,

  totalCount: 0,

  filters: {
    sortField: "publicationYear:desc",
    skip: 0,
    limit: 25
  }
};
