import { FileOrigdatablock } from "state-management/models";
import * as fromActions from "./files.actions";

describe("File Actions", () => {
  const origDatablock: FileOrigdatablock = {
    id: "orig-datablock-id",
    datasetId: "dataset-id",
    dataFileList: {
      path: "/file/1",
      size: 100,
      time: "2019-09-06T13:11:37.102Z",
    },
  };
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

  describe("fetchDatasetOrigDatablocksAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchDatasetOrigDatablocksAction({
        datasetId: "dataset-id",
        limit: 10,
        skip: 0,
      });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Dataset Orig Datablocks",
        datasetId: "dataset-id",
        limit: 10,
        skip: 0,
      });
    });
  });

  describe("fetchDatasetOrigDatablocksCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchDatasetOrigDatablocksCompleteAction({
        currentDatasetOrigDatablocks: origDatablocks,
      });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Dataset Orig Datablocks Complete",
        currentDatasetOrigDatablocks: origDatablocks,
      });
    });
  });

  describe("fetchDatasetOrigDatablocksFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchDatasetOrigDatablocksFailedAction();

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Fetch Dataset Orig Datablocks Failed",
      });
    });
  });

  describe("selectOrigDatablockAction", () => {
    it("should create an action", () => {
      const action = fromActions.selectOrigDatablockAction({ origDatablock });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Select Orig Datablock",
        origDatablock,
      });
    });
  });

  describe("deselectOrigDatablockAction", () => {
    it("should create an action", () => {
      const action = fromActions.deselectOrigDatablockAction({
        origDatablock,
      });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Deselect Orig Datablock",
        origDatablock,
      });
    });
  });

  describe("selectAllOrigDatablocksAction", () => {
    it("should create an action", () => {
      const action = fromActions.selectAllOrigDatablocksAction({
        origDatablocks,
      });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Select All Orig Datablocks",
        origDatablocks,
      });
    });
  });

  describe("deselectOrigDatablocksAction", () => {
    it("should create an action", () => {
      const action = fromActions.deselectOrigDatablocksAction({
        origDatablocks,
      });

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Deselect Orig Datablocks",
        origDatablocks,
      });
    });
  });

  describe("clearSelectionAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearSelectionAction();

      expect({ ...action }).toEqual({
        type: "[OrigDatablock] Clear Selection",
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
