import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { PublishedData } from "state-management/models";
import {
  PublishedDataActions,
  PublishedDataActionTypes
} from "../actions/published-data.actions";

export interface State extends EntityState<PublishedData> {
  // additional entities state properties
}

export const adapter: EntityAdapter<PublishedData> = createEntityAdapter<
  PublishedData
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function publishedDataReducer(
  state = initialState,
  action: PublishedDataActions
): State {
  console.log("Action came in! " + action.type);
  switch (action.type) {
    case PublishedDataActionTypes.AddPublishedData: {
      return adapter.addOne(action.payload.publishedData, state);
    }

    case PublishedDataActionTypes.UpsertPublishedData: {
      return adapter.upsertOne(action.payload.publishedData, state);
    }

    case PublishedDataActionTypes.AddPublishedDatas: {
      return adapter.addMany(action.payload.publishedDatas, state);
    }

    case PublishedDataActionTypes.UpsertPublishedDatas: {
      return adapter.upsertMany(action.payload.publishedDatas, state);
    }

    case PublishedDataActionTypes.UpdatePublishedData: {
      return adapter.updateOne(action.payload.publishedData, state);
    }

    case PublishedDataActionTypes.UpdatePublishedDatas: {
      return adapter.updateMany(action.payload.publishedDatas, state);
    }

    case PublishedDataActionTypes.DeletePublishedData: {
      return adapter.removeOne(action.payload.id, state);
    }

    case PublishedDataActionTypes.DeletePublishedDatas: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case PublishedDataActionTypes.LoadPublishedDatas: {
      return adapter.addAll(action.payload.publishedDatas, state);
    }

    case PublishedDataActionTypes.ClearPublishedDatas: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
