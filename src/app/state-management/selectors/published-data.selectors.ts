import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PublishedDataState } from "state-management/state/published-data.store";

const getPublishedDataState = createFeatureSelector<PublishedDataState>(
  "publishedData"
);

export const getAllPublishedData = createSelector(
  getPublishedDataState,
  state => state.publishedData
);

export const getCurrentPublishedData = createSelector(
  getPublishedDataState,
  state => state.currentPublishedData
);

export const getPublishedDataCount = createSelector(
  getPublishedDataState,
  state => state.totalCount
);

export const getFilters = createSelector(
  getPublishedDataState,
  state => state.filters
);

export const getPage = createSelector(
  getFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getPublishedDataPerPage = createSelector(
  getFilters,
  filters => filters.limit
);

export const getQueryParams = createSelector(
  getFilters,
  filters => {
    const { sortField, skip, limit } = filters;
    return { order: sortField, skip, limit };
  }
);
