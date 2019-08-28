import {
  publishedDataReducer,
  getSelectedPublishedDataId
} from "./published-data.reducer";
import { initialPublishedDataState } from "../state/publishedData.store";
import {
  AddPublishedData,
  ChangePagePub,
  FetchPublishedData,
  FetchCountPublishedData,
  LoadCurrentPublishedData,
  UpsertPublishedData,
  UpsertWaitPublishedData,
  AddPublishedDatas,
  UpsertPublishedDatas,
  UpdatePublishedData,
  UpdatePublishedDatas,
  DeletePublishedData,
  DeletePublishedDatas,
  LoadPublishedDatas,
  ClearPublishedDatas
} from "state-management/actions/published-data.actions";
import { PublishedData } from "shared/sdk";
import { Update } from "@ngrx/entity";

describe("PublishedData Reducer", () => {
  describe("default", () => {
    it("should return the initial state", () => {
      const action = {} as any;
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state).toBe(initialPublishedDataState);
    });
  });

  describe("AddPublishedData", () => {
    xit("should return the initial state", () => {
      const payload = {
        publishedData: new PublishedData()
      };
      const action = new AddPublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);
    });
  });

  describe("LoadCurrentPublishedData", () => {
    it("should set currentPublishedData", () => {
      const payload = {
        publishedData: new PublishedData()
      };
      const action = new LoadCurrentPublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.currentPublishedData).toEqual(payload.publishedData);
    });
  });

  describe("UpsertPublishedData", () => {
    xit("should ...", () => {
      const payload = {
        publishedData: new PublishedData()
      };
      const action = new UpsertPublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);
    });
  });

  describe("UpsertWaitPublishedData", () => {
    it("should return the initial state", () => {
      const payload = {
        publishedData: new PublishedData()
      };
      const action = new UpsertWaitPublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state).toEqual(initialPublishedDataState);
    });
  });

  describe("AddPublishedDatas", () => {
    xit("should ...", () => {
      const payload = {
        publishedDatas: [new PublishedData()]
      };
      const action = new AddPublishedDatas(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);
    });
  });

  describe("UpsertPublishedDatas", () => {
    xit("should ...", () => {
      const payload = {
        publishedDatas: [new PublishedData()]
      };
      const action = new UpsertPublishedDatas(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);
    });
  });

  describe("UpdatePublishedData", () => {
    xit("should ...", () => {
      let update: Update<PublishedData> = null;
      const payload = {
        publishedData: update
      };
      const action = new UpdatePublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);
    });
  });

  describe("UpdatePublishedDatas", () => {
    it("should return the initial state", () => {
      let updates: Update<PublishedData>[] = [];
      const payload = {
        publishedDatas: updates
      };
      const action = new UpdatePublishedDatas(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state).toEqual(initialPublishedDataState);
    });
  });

  describe("DeletePublishedData", () => {
    it("should return the initial state", () => {
      const payload = {
        id: "abc123"
      };
      const action = new DeletePublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state).toEqual(initialPublishedDataState);
    });
  });

  describe("DeletePublishedDatas", () => {
    it("should return the initial state", () => {
      const payload = {
        ids: ["abc123"]
      };
      const action = new DeletePublishedDatas(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state).toEqual(initialPublishedDataState);
    });
  });

  describe("LoadPublishedDatas", () => {
    xit("should ...", () => {
      const payload = {
        publishedDatas: [new PublishedData()]
      };
      const action = new LoadPublishedDatas(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);
    });
  });

  describe("ClearPublishedDatas", () => {
    it("should return the initial state", () => {
      const action = new ClearPublishedDatas();
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state).toEqual(initialPublishedDataState);
    });
  });

  describe("ChangePagePub", () => {
    it("should set filters", () => {
      const payload = {
        page: 2,
        limit: 25
      };
      const action = new ChangePagePub(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.filters.limit).toEqual(payload.limit);
      expect(state.filters.skip).toEqual(payload.page * payload.limit);
    });
  });

  describe("FetchCountPublishedData", () => {
    it("should set the count", () => {
      const payload = {
        count: 100
      };
      const action = new FetchCountPublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.count).toEqual(payload.count);
    });
  });

  describe("FetchPublishedData", () => {
    it("should set currentPublishedData", () => {
      const payload = {
        id: "abc123"
      };
      const action = new FetchPublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.currentPublishedData).toEqual(state.entities[payload.id]);
    });
  });

  describe("#getSelectedPublishedDataId()", () => {
    it("should return the doi of currentPublishedData", () => {
      const payload = {
        publishedData: new PublishedData()
      };
      const action = new LoadCurrentPublishedData(payload);
      const state = publishedDataReducer(initialPublishedDataState, action);
      const doi = getSelectedPublishedDataId(state);

      expect(doi).toEqual(state.currentPublishedData.doi);
    });
  });

  describe("selectPublishedDataIds", () => {
    it("", () => {});
  });

  describe("selectPublishedDataEntities", () => {
    it("", () => {});
  });

  describe("selectAllPublishedData", () => {
    it("", () => {});
  });

  describe("selectPublishedDataTotal", () => {
    it("", () => {});
  });
});
