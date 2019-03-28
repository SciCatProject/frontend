import { publishedDataReducer, initialState } from "./published-data.reducer";

describe("PublishedData Reducer", () => {
  describe("unknown action", () => {
    it("should return the initial state", () => {
      const action = {} as any;

      const result = publishedDataReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
