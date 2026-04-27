import * as fromSelectors from "./files.selectors";
import { selectSettings } from "./user.selectors";
import {
  GenericFilters,
  FilesDatasetFilter,
  FileOrigdatablock,
} from "state-management/models";
import { FilesState } from "state-management/state/files.store";
import { initialUserState } from "state-management/state/user.store";

const filesFilters: GenericFilters = {
  sortField: "name desc",
  skip: 0,
  limit: 25,
};

const filesDatasetFilter: FilesDatasetFilter = {
  sortField: "name desc",
  skip: 0,
  limit: 25,
  datasetId: "",
};

const origDatablock: FileOrigdatablock = {
  id: "orig-datablock-id",
  datasetId: "dataset-id",
  dataFileList: {
    path: "/file/1",
    size: 100,
    time: "2019-09-06T13:11:37.102Z",
  },
};

const initialFilesState: FilesState = {
  origDatablocks: [],
  currentDatasetOrigDatablocks: [origDatablock],
  currentOrigDatablock: origDatablock,
  selectedOrigDatablocks: [origDatablock],
  totalCount: 0,
  currentDatasetCount: 1,
  selectedOrigDatablocksCount: 1,

  filters: filesFilters,
  datasetFilter: filesDatasetFilter,
};

describe("Files Selectors", () => {
  describe("selectAllOrigDatablocks", () => {
    it("should select origDatablocks", () => {
      expect(
        fromSelectors.selectAllOrigDatablocks.projector(initialFilesState),
      ).toEqual([]);
    });
  });

  describe("selectCurrentOrigDatablock", () => {
    it("should select current origDatablock", () => {
      expect(
        fromSelectors.selectCurrentOrigDatablock.projector(initialFilesState),
      ).toEqual(origDatablock);
    });
  });

  describe("selectCurrentDatasetOrigDatablocks", () => {
    it("should select current dataset origDatablocks", () => {
      expect(
        fromSelectors.selectCurrentDatasetOrigDatablocks.projector(
          initialFilesState,
        ),
      ).toEqual([origDatablock]);
    });
  });

  describe("selectOrigDatablocksCount", () => {
    it("should select the total origDatablocks count", () => {
      expect(
        fromSelectors.selectOrigDatablocksCount.projector(initialFilesState),
      ).toEqual(0);
    });
  });

  describe("selectCurrentDatasetOrigDatablocksCount", () => {
    it("should select the current dataset origDatablocks count", () => {
      expect(
        fromSelectors.selectCurrentDatasetOrigDatablocksCount.projector(
          initialFilesState,
        ),
      ).toEqual(1);
    });
  });

  describe("selectSelectedOrigDatablocks", () => {
    it("should select selected origDatablocks", () => {
      expect(
        fromSelectors.selectSelectedOrigDatablocks.projector(initialFilesState),
      ).toEqual([origDatablock]);
    });
  });

  describe("selectSelectedOrigDatablocksCount", () => {
    it("should select selected origDatablocks count", () => {
      expect(
        fromSelectors.selectSelectedOrigDatablocksCount.projector(
          initialFilesState,
        ),
      ).toEqual(1);
    });
  });

  describe("selectFilesWithCountAndTableSettings", () => {
    it("should select the origDatablocks with count and table settings", () => {
      expect(
        fromSelectors.selectFilesWithCountAndTableSettings.projector(
          fromSelectors.selectAllOrigDatablocks.projector(initialFilesState),
          fromSelectors.selectOrigDatablocksCount.projector(initialFilesState),
          selectSettings.projector(initialUserState),
        ),
      ).toEqual({
        origDatablocks: [],
        count: 0,
        tablesSettings: {
          columns: initialUserState.settings.fe_file_table_columns,
        },
      });
    });
  });

  describe("selectCurrentDatasetFilesWithCountAndTableSettings", () => {
    it("should select current dataset origDatablocks with count, selection, and table settings", () => {
      expect(
        fromSelectors.selectCurrentDatasetFilesWithCountAndTableSettings.projector(
          fromSelectors.selectCurrentDatasetOrigDatablocks.projector(
            initialFilesState,
          ),
          fromSelectors.selectCurrentDatasetOrigDatablocksCount.projector(
            initialFilesState,
          ),
          fromSelectors.selectSelectedOrigDatablocks.projector(
            initialFilesState,
          ),
          selectSettings.projector(initialUserState),
        ),
      ).toEqual({
        origDatablocks: [origDatablock],
        count: 1,
        selectedOrigDatablocks: [origDatablock],
        tablesSettings: {
          columns: initialUserState.settings.fe_datafiles_table_columns,
        },
      });
    });
  });
});
