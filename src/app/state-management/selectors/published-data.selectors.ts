import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap
} from "@ngrx/store";
import * as fromPublishedData from "../reducers/published-data.reducer";
import { PublishedDataState } from "../state/publishedData.store";

export interface State {
    PublishedData: PublishedDataState;
}

export const reducers: ActionReducerMap<State> = {
    PublishedData: fromPublishedData.publishedDataReducer
};

export const selectPublishedDataState = createFeatureSelector<PublishedDataState>("PublishedData");

export const selectPublishedDataIds = createSelector(
  selectPublishedDataState,
  fromPublishedData.selectPublishedDataIds
);
export const selectPublishedDataEntities = createSelector(
  selectPublishedDataState,
  fromPublishedData.selectPublishedDataEntities
);
export const selectAllPublished = createSelector(
  selectPublishedDataState,
  fromPublishedData.selectAllPublishedData
);

export const selectFilteredPublished = createSelector(
  selectPublishedDataState,
  selectAllPublished,
  (state, data) => {
    return data.slice(state.filters.skip, state.filters.skip + state.filters.limit);
  }
);

export const selectPublishedDataTotal = createSelector(
  selectPublishedDataState,
  fromPublishedData.selectPublishedDataTotal
);
export const selectCurrentPublishedDataId = createSelector(
  selectPublishedDataState,
  fromPublishedData.getSelectedPublishedDataId
);

export const selectCurrentPublishedData = createSelector(
  selectPublishedDataEntities,
  selectCurrentPublishedDataId,
  (publishedDataEntities, doi) => publishedDataEntities[doi] // this is a dictionary look up
);

export const getFilters = createSelector(
  selectPublishedDataState,
  (state) => {
    const { skip, limit, sortField } = state.filters;
    const limits = { skip, limit, order: sortField };
    return {limits};
  }
);

export const getCount = createSelector(
  selectPublishedDataState,
  (state) => {
    return state.count;
  }
);
