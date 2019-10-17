import { PublishedData, PublishedDataFilters } from "state-management/models";

export interface PublishedDataState {
  publishedData: PublishedData[];
  currentPublishedData: PublishedData;

  totalCount: number;

  isLoading: boolean;

  filters: PublishedDataFilters;
}

export const initialPublishedDataState: PublishedDataState = {
  publishedData: [],
  currentPublishedData: null,

  totalCount: 0,

  isLoading: false,

  filters: {
    sortField: "publicationYear:desc",
    skip: 0,
    limit: 25
  }
};
