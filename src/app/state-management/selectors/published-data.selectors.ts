import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PublishedDataState } from "state-management/state/published-data.store";

const selectPublishedDataState =
  createFeatureSelector<PublishedDataState>("publishedData");

export const selectAllPublishedData = createSelector(
  selectPublishedDataState,
  (state) => state.publishedData,
);

export const selectCurrentPublishedData = createSelector(
  selectPublishedDataState,
  (state) => state.currentPublishedData,
);

export const selectPublishedDataCount = createSelector(
  selectPublishedDataState,
  (state) => state.totalCount,
);

export const selectFilters = createSelector(
  selectPublishedDataState,
  (state) => state.filters,
);

export const selectPage = createSelector(selectFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const selectPublishedDataPerPage = createSelector(
  selectFilters,
  (filters) => filters.limit,
);

export const selectPublishedDataDashboardPageViewModel = createSelector(
  selectAllPublishedData,
  selectPublishedDataCount,
  selectPage,
  selectPublishedDataPerPage,
  selectFilters,
  (publishedData, count, currentPage, publishedDataPerPage, filters) => ({
    publishedData,
    count,
    currentPage,
    publishedDataPerPage,
    filters,
  }),
);

export const selectQueryParams = createSelector(selectFilters, (filters) => {
  const { sortField, skip, limit } = filters;
  return { order: sortField, skip, limit };
});
