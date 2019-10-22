import { PublishedDataInterface, PublishedData } from "shared/sdk";
import { PublishedDataFilters } from "state-management/models";
import { PublishedDataState } from "state-management/state/published-data.store";
import * as fromSelectors from "./published-data.selectors";

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

describe("Published Data Selectors", () => {
  describe("getAllPublishedData", () => {
    it("should get publishedData", () => {
      expect(
        fromSelectors.getAllPublishedData.projector(initialPublishedDataState)
      ).toEqual([]);
    });
  });

  describe("getCurrentPublishedData", () => {
    it("should get currentPublishedData", () => {
      expect(
        fromSelectors.getCurrentPublishedData.projector(
          initialPublishedDataState
        )
      ).toEqual(publishedData);
    });
  });

  describe("getPublishedDataCount", () => {
    it("should get totalCount", () => {
      expect(
        fromSelectors.getPublishedDataCount.projector(initialPublishedDataState)
      ).toEqual(0);
    });
  });

  describe("getFilters", () => {
    it("should get filters", () => {
      expect(
        fromSelectors.getFilters.projector(initialPublishedDataState)
      ).toEqual(filters);
    });
  });

  describe("getPage", () => {
    it("should get current page from filters", () => {
      const { skip, limit } = filters;
      const page = skip / limit;
      expect(
        fromSelectors.getPage.projector(initialPublishedDataState.filters)
      ).toEqual(page);
    });
  });

  describe("getPublishedDataPerPage", () => {
    it("should get limit from filters", () => {
      const { limit } = filters;
      expect(
        fromSelectors.getPublishedDataPerPage.projector(
          initialPublishedDataState.filters
        )
      ).toEqual(limit);
    });
  });

  describe("getQueryParams", () => {
    it("should get query params from filters", () => {
      const { sortField, skip, limit } = filters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.getQueryParams.projector(
          initialPublishedDataState.filters
        )
      ).toEqual(params);
    });
  });
});
