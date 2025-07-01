import * as fromSelectors from "./files.selectors";
import { selectTablesSettings } from "./user.selectors";
import { GenericFilters } from "state-management/models";
import { mockOrigDatablock as origDatablock } from "shared/MockStubs";
import { FilesState } from "state-management/state/files.store";
import { initialUserState } from "state-management/state/user.store";

const filesFilters: GenericFilters = {
  sortField: "name desc",
  skip: 0,
  limit: 25,
};

const initialFilesState: FilesState = {
  origDatablocks: [],
  currentOrigDatablock: origDatablock,
  totalCount: 0,

  filters: filesFilters,
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

  describe("selectOrigDatablocksCount", () => {
    it("should select the total origDatablocks count", () => {
      expect(
        fromSelectors.selectOrigDatablocksCount.projector(initialFilesState),
      ).toEqual(0);
    });
  });

  describe("selectFilesWithCountAndTableSettings", () => {
    it("should select the origDatablocks with count and table settings", () => {
      expect(
        fromSelectors.selectFilesWithCountAndTableSettings.projector(
          fromSelectors.selectAllOrigDatablocks.projector(initialFilesState),
          fromSelectors.selectOrigDatablocksCount.projector(initialFilesState),
          selectTablesSettings.projector(initialUserState),
        ),
      ).toEqual({
        origDatablocks: [],
        count: 0,
        tablesSettings: {},
      });
    });
  });
});
