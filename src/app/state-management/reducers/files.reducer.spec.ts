import * as fromActions from "state-management/actions/files.actions";
import { initialFilesState } from "state-management/state/files.store";
import { FileOrigdatablock } from "state-management/models";
import { filesReducer } from "./files.reducer";

describe("FilesReducer", () => {
  const origDatablock: FileOrigdatablock = {
    id: "orig-datablock-id",
    datasetId: "dataset-id",
    dataFileList: {
      path: "/file/1",
      size: 100,
      time: "2019-09-06T13:11:37.102Z",
    },
  };
  const secondOrigDatablock: FileOrigdatablock = {
    id: "orig-datablock-id",
    datasetId: "dataset-id",
    dataFileList: {
      path: "/file/2",
      size: 200,
      time: "2019-09-06T13:11:37.102Z",
    },
  };

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

  describe("on fetchDatasetOrigDatablocksCompleteAction", () => {
    it("should set currentDatasetOrigDatablocks property", () => {
      const currentDatasetOrigDatablocks = [origDatablock];
      const action = fromActions.fetchDatasetOrigDatablocksCompleteAction({
        currentDatasetOrigDatablocks,
      });
      const state = filesReducer(initialFilesState, action);

      expect(state.currentDatasetOrigDatablocks).toEqual(
        currentDatasetOrigDatablocks,
      );
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set count property", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = filesReducer(initialFilesState, action);

      expect(state.totalCount).toEqual(count);
    });

    it("should set current dataset count if fields include datasetId", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({
        count,
        fields: { datasetId: "dataset-id" },
      });
      const state = filesReducer(initialFilesState, action);

      expect(state.currentDatasetCount).toEqual(count);
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

  describe("on selectOrigDatablockAction", () => {
    it("should add an origDatablock to selectedOrigDatablocks", () => {
      const action = fromActions.selectOrigDatablockAction({ origDatablock });
      const state = filesReducer(initialFilesState, action);

      expect(state.selectedOrigDatablocks).toEqual([origDatablock]);
      expect(state.selectedOrigDatablocksCount).toEqual(1);
    });

    it("should not duplicate an already selected origDatablock file", () => {
      const stateWithSelection = {
        ...initialFilesState,
        selectedOrigDatablocks: [origDatablock],
        selectedOrigDatablocksCount: 1,
      };
      const action = fromActions.selectOrigDatablockAction({ origDatablock });
      const state = filesReducer(stateWithSelection, action);

      expect(state.selectedOrigDatablocks).toEqual([origDatablock]);
      expect(state.selectedOrigDatablocksCount).toEqual(1);
    });
  });

  describe("on selectAllOrigDatablocksAction", () => {
    it("should merge origDatablocks into selectedOrigDatablocks", () => {
      const action = fromActions.selectAllOrigDatablocksAction({
        origDatablocks: [origDatablock, secondOrigDatablock],
      });
      const state = filesReducer(initialFilesState, action);

      expect(state.selectedOrigDatablocks).toEqual([
        origDatablock,
        secondOrigDatablock,
      ]);
      expect(state.selectedOrigDatablocksCount).toEqual(2);
    });
  });

  describe("on deselectOrigDatablockAction", () => {
    it("should remove an origDatablock from selectedOrigDatablocks", () => {
      const stateWithSelection = {
        ...initialFilesState,
        selectedOrigDatablocks: [origDatablock, secondOrigDatablock],
        selectedOrigDatablocksCount: 2,
      };
      const action = fromActions.deselectOrigDatablockAction({
        origDatablock,
      });
      const state = filesReducer(stateWithSelection, action);

      expect(state.selectedOrigDatablocks).toEqual([secondOrigDatablock]);
      expect(state.selectedOrigDatablocksCount).toEqual(1);
    });
  });

  describe("on deselectOrigDatablocksAction", () => {
    it("should remove multiple origDatablocks from selectedOrigDatablocks", () => {
      const stateWithSelection = {
        ...initialFilesState,
        selectedOrigDatablocks: [origDatablock, secondOrigDatablock],
        selectedOrigDatablocksCount: 2,
      };
      const action = fromActions.deselectOrigDatablocksAction({
        origDatablocks: [origDatablock, secondOrigDatablock],
      });
      const state = filesReducer(stateWithSelection, action);

      expect(state.selectedOrigDatablocks).toEqual([]);
      expect(state.selectedOrigDatablocksCount).toEqual(0);
    });
  });

  describe("on clearSelectionAction", () => {
    it("should clear selectedOrigDatablocks", () => {
      const stateWithSelection = {
        ...initialFilesState,
        selectedOrigDatablocks: [origDatablock],
        selectedOrigDatablocksCount: 1,
      };
      const action = fromActions.clearSelectionAction();
      const state = filesReducer(stateWithSelection, action);

      expect(state.selectedOrigDatablocks).toEqual([]);
      expect(state.selectedOrigDatablocksCount).toEqual(0);
    });
  });
});
