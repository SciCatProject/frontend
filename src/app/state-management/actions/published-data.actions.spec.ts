import { mockPublishedData } from "shared/MockStubs";
import * as fromActions from "./published-data.actions";

describe("Published Data Actions", () => {
  const publishedData = mockPublishedData;

  describe("fetchAllPublishedDataAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchAllPublishedDataAction();
      expect({ ...action }).toEqual({
        type: "[PublishedData] Fetch All Published Data",
      });
    });
  });

  describe("fetchAllPublishedDataCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchAllPublishedDataCompleteAction({
        publishedData: [publishedData],
      });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Fetch All Published Data Complete",
        publishedData: [publishedData],
      });
    });
  });

  describe("fetchAllPublishedDataFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchAllPublishedDataFailedAction();
      expect({ ...action }).toEqual({
        type: "[PublishedData] Fetch All Published Datas Failed",
      });
    });
  });

  describe("fetchCountAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountAction();
      expect({ ...action }).toEqual({ type: "[PublishedData] Fetch Count" });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Fetch Count Complete",
        count,
      });
    });
  });

  describe("fetchCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountFailedAction();
      expect({ ...action }).toEqual({
        type: "[PublishedData] Fetch Count Failed",
      });
    });
  });

  describe("fetchPublishedDataAction", () => {
    it("should create an action", () => {
      const id = "testId";
      const action = fromActions.fetchPublishedDataAction({ id });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Fetch Published Data",
        id,
      });
    });
  });

  describe("fetchPublishedDataCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchPublishedDataCompleteAction({
        publishedData,
      });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Fetch Published Data Complete",
        publishedData,
      });
    });
  });

  describe("fetchPublishedDataFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchPublishedDataFailedAction();
      expect({ ...action }).toEqual({
        type: "[PublishedData] Fetch Published Data Failed",
      });
    });
  });

  describe("publishDatasetAction", () => {
    it("should create an action", () => {
      const action = fromActions.publishDatasetAction({ data: publishedData });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Publish Dataset",
        data: publishedData,
      });
    });
  });

  describe("publishDatasetCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.publishDatasetCompleteAction({
        publishedData,
      });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Publish Dataset Complete",
        publishedData,
      });
    });
  });

  describe("publishDatasetFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.publishDatasetFailedAction();
      expect({ ...action }).toEqual({
        type: "[PublishedData] Publish Dataset Failed",
      });
    });
  });

  describe("registerPublishedDataAction", () => {
    it("should create an action", () => {
      const doi = "testDOI";
      const action = fromActions.registerPublishedDataAction({ doi });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Register Published Data",
        doi,
      });
    });
  });

  describe("registerPublishedDataCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.registerPublishedDataCompleteAction({
        publishedData,
      });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Register Published Data Complete",
        publishedData,
      });
    });
  });

  describe("registerPublishedDataFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.registerPublishedDataFailedAction();
      expect({ ...action }).toEqual({
        type: "[PublishedData] Register Published Data Failed",
      });
    });
  });

  describe("changePageAction", () => {
    it("should create an action", () => {
      const page = 1;
      const limit = 25;
      const action = fromActions.changePageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[PublishedData] Change Page",
        page,
        limit,
      });
    });
  });

  describe("clearPublishedDataStateAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearPublishedDataStateAction();

      expect({ ...action }).toEqual({ type: "[PublischedData] Clear State" });
    });
  });
});
