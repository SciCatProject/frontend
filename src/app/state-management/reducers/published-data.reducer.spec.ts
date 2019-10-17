import { PublishedDataState } from "state-management/state/published-data.store";
import * as fromActions from "state-management/actions/published-data.actions";
import { publishedDataReducer } from "./published-data.reducer";
import { PublishedData, PublishedDataInterface } from "shared/sdk";
import { PublishedDataFilters } from "state-management/models";

const data: PublishedDataInterface = {
  doi: "testDOI",
  affiliation: "test affiliation",
  creator: "test creator",
  publisher: "test publisher",
  publicationYear: 2019,
  title: "test title",
  abstract: "test abstract",
  dataDescription: "test description",
  resourceType: "test type",
  pidArray: ["testPid"],
  authors: ["test author"]
};
const publishedData = new PublishedData(data);

const filters: PublishedDataFilters = {
  sortField: "publicationYear desc",
  skip: 0,
  limit: 25
};

const initialPublishedDataState: PublishedDataState = {
  publishedData: [],
  currentPublishedData: publishedData,

  totalCount: 0,

  isLoading: false,

  filters
};

describe("PublishedData Reducer", () => {
  describe("on fetchAllPublishedDataAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchAllPublishedDataAction();
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchAllPublishedDataCompleteAction", () => {
    it("should set publishedData and set isLoading to false", () => {
      const allPublishedData = [publishedData];
      const action = fromActions.fetchAllPublishedDataCompleteAction({
        publishedData: allPublishedData
      });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.publishedData).toEqual(allPublishedData);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchAllPublishedDataFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchAllPublishedDataFailedAction();
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchCountAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchCountAction();
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount and set isLoading to false", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.totalCount).toEqual(count);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchCountFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchCountFailedAction();
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchPublishedDataAction", () => {
    it("should set isLoading to true", () => {
      const id = "testId";
      const action = fromActions.fetchPublishedDataAction({ id });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchPublishedDataCompleteAction", () => {
    it("should set currentPublishedData and set isLoading to false", () => {
      const action = fromActions.fetchPublishedDataCompleteAction({
        publishedData
      });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.currentPublishedData).toEqual(publishedData);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchPublishedDataFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchPublishedDataFailedAction();
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on publishDatasetAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.publishDatasetAction({ data: publishedData });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on publishDatasetCompleteAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.publishDatasetCompleteAction({
        publishedData
      });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on publishDatasetFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.publishDatasetFailedAction();
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on registerPublishedDataAction", () => {
    it("should set isLoading to true", () => {
      const doi = "testDOI";
      const action = fromActions.registerPublishedDataAction({ doi });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on registerPublishedDataCompleteAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.registerPublishedDataCompleteAction({
        publishedData
      });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on registerPublishedDataFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.registerPublishedDataFailedAction();
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit filters", () => {
      const page = 1;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.filters.limit).toEqual(limit);
      expect(state.filters.skip).toEqual(skip);
    });
  });
});
