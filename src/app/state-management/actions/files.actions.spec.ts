import { mockOrigDatablock as origDatablock } from "shared/MockStubs";
import * as fromActions from "./files.actions";

describe("File Actions", () => {
  const origDatablocks = [origDatablock];

  describe("fetchAllOrigDatablocksAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchAllOrigDatablocksAction({});

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch All Orig Datablocks",
      });
    });
  });

  describe("fetchAllOrigDatablocksCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchAllOrigDatablocksCompleteAction({
        origDatablocks: origDatablocks,
      });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch All Orig Datablocks Complete",
        origDatablocks,
      });
    });
  });

  describe("fetchAllOrigDatablocksFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchAllOrigDatablocksFailedAction();

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch All Orig Datablocks Failed",
      });
    });
  });

  describe("fetchCountAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountAction({});

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Count",
      });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Count Complete",
        count,
      });
    });
  });

  describe("fetchCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountFailedAction();

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Count Failed",
      });
    });
  });

  describe("fetchOrigDatablockAction", () => {
    it("should create an action", () => {
      const id = "testId";
      const action = fromActions.fetchOrigDatablockAction({ id });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Orig Datablock",
        id,
      });
    });
  });

  describe("fetchOrigDatablockCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchOrigDatablockCompleteAction({
        origDatablock,
      });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Orig Datablock Complete",
        origDatablock,
      });
    });
  });

  describe("fetchOrigDatablockFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchOrigDatablockFailedAction();

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Orig Datablock Failed",
      });
    });
  });

  describe("clearFilesStateAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearOrigDatablockStateAction();

      expect({ ...action }).toEqual({ type: "[OrigDatablock] Clear State" });
    });
  });
});
