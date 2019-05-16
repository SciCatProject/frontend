import {
  PublishedDataActions,
  PublishedDataActionTypes
} from "../actions/published-data.actions";
import { adapter, PublishedDataState, initialPublishedDataState } from "../state/publishedData.store";

export function publishedDataReducer(
  state = initialPublishedDataState,
  action: PublishedDataActions
): PublishedDataState {
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

    case PublishedDataActionTypes.ChangePagePub: {
      const limit = action.payload.limit;
      const skip = action.payload.page * limit;
      const filters = { ...state.filters, skip, limit };
      return {...state, filters};
    }

    case PublishedDataActionTypes.FetchCountPublishedData: {
      const count = action.payload.count;
      return {...state, count};
    }

    default: {
      return state;
    }
  }
}

export const getSelectedPublishedDataId = (state: PublishedDataState) => state.currentPublishedData.doi;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

// select the array of user ids
export const selectPublishedDataIds = selectIds;

// select the dictionary of user entities
export const selectPublishedDataEntities = selectEntities;

// select the array of users
export const selectAllPublishedData = selectAll;

// select the total user count
export const selectPublishedDataTotal = selectTotal;
