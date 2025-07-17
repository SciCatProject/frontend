import * as fromActions from "state-management/actions/files.actions";
import { initialFilesState } from "state-management/state/files.store";
import { mockOrigDatablock as origDatablock } from "shared/MockStubs";
import { filesReducer } from "./files.reducer";

describe("FilesReducer", () => {
  describe("on fetchAllOrigDatablocksCompleteAction", () => {
    it("should set origDatablocks property", () => {
      const origDatablocks = [origDatablock];
      const action = fromActions.fetchAllOrigDatablocksCompleteAction({
        origDatablocks,
      });
      const state = filesReducer(initialFilesState, action);

      expect(state.origDatablocks).toEqual(origDatablocks);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set count property", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = filesReducer(initialFilesState, action);

      expect(state.totalCount).toEqual(count);
    });
  });

  describe("on fetchOrigDatablockCompleteAction", () => {
    it("should set currentOrigDatablock property", () => {
      const action = fromActions.fetchOrigDatablockCompleteAction({
        origDatablock,
      });
      const state = filesReducer(initialFilesState, action);

      expect(state.currentOrigDatablock).toEqual(origDatablock);
    });
  });

  describe("on clearOrigDatablockStateAction", () => {
    it("should set files state to initialFilesState", () => {
      const action = fromActions.clearOrigDatablockStateAction();
      const state = filesReducer(initialFilesState, action);

      expect(state).toEqual(initialFilesState);
    });
  });
});
