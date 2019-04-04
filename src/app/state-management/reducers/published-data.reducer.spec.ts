import { publishedDataReducer } from "./published-data.reducer";
import { initialPublishedDataState } from "../state/publishedData.store";

describe("PublishedData Reducer", () => {
  describe("unknown action", () => {
    it("should return the initial state", () => {
      const action = {} as any;

      const result = publishedDataReducer(initialPublishedDataState, action);

      expect(result).toBe(initialPublishedDataState);
    });
  });
});
