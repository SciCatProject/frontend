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
export const selectAllPublishedData = createSelector(
  selectPublishedDataState,
  fromPublishedData.selectAllPublishedData
);
export const selecPublishedDataTotal = createSelector(
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
  (publishedDataEntities, doi) => publishedDataEntities[doi]
);
