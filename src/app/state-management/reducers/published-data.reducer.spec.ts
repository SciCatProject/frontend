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

  filters
};

describe("PublishedData Reducer", () => {
  describe("on fetchAllPublishedDataCompleteAction", () => {
    it("should set publishedData", () => {
      const allPublishedData = [publishedData];
      const action = fromActions.fetchAllPublishedDataCompleteAction({
        publishedData: allPublishedData
      });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.publishedData).toEqual(allPublishedData);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.totalCount).toEqual(count);
    });
  });

  describe("on fetchPublishedDataCompleteAction", () => {
    it("should set currentPublishedData", () => {
      const action = fromActions.fetchPublishedDataCompleteAction({
        publishedData
      });
      const state = publishedDataReducer(initialPublishedDataState, action);

      expect(state.currentPublishedData).toEqual(publishedData);
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
