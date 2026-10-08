import { PublishedData } from "@scicatproject/scicat-sdk-ts-angular";
import { PublishedDataFilters } from "state-management/models";

export interface PublishedDataState {
  publishedData: PublishedData[];
  currentPublishedData: PublishedData | undefined;

  totalCount: number;

  filters: PublishedDataFilters;

  publishedDataConfig?: any;
}

export const initialPublishedDataState: PublishedDataState = {
  publishedData: [],
  currentPublishedData: undefined,

  totalCount: 0,

  filters: {
    text: "",
    sortField: "createdAt:desc",
    skip: 0,
    limit: 25,
  },

  publishedDataConfig: {},
};
