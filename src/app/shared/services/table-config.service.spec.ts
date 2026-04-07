import { TableConfigService } from "./table-config.service";
import { AbstractField } from "../modules/dynamic-material-table/models/table-field.model";

describe("TableConfigService", () => {
  let service: TableConfigService;

  beforeEach(() => {
    service = new TableConfigService();
  });

  describe("#mergeColumnSettings()", () => {
    const defaultColumns: AbstractField[] = [
      { name: "pid", header: "PID", display: "visible", width: 130 },
      { name: "size", header: "Size", display: "hidden", width: 150 },
      { name: "createdAt", header: "Created", display: "visible", width: 200 },
    ];

    it("merges saved settings with matching defaults and appends new defaults", () => {
      const merged = service.mergeColumnSettings(defaultColumns, [
        { name: "size", display: "visible", width: 220, index: 0 },
        { name: "pid", display: "hidden", width: 140, index: 1 },
      ]);

      expect(merged).toEqual([
        jasmine.objectContaining({
          name: "size",
          header: "Size",
          display: "visible",
          width: 220,
          index: 0,
        }),
        jasmine.objectContaining({
          name: "pid",
          header: "PID",
          display: "hidden",
          width: 140,
          index: 1,
        }),
        jasmine.objectContaining({
          name: "createdAt",
          header: "Created",
          display: "visible",
          width: 200,
        }),
      ]);
    });

    it("preserves user-added columns that are not part of defaults", () => {
      const customColumn = {
        name: "scientificMetadata.sample.temperature",
        header: "Temperature",
        path: "scientificMetadata.sample.temperature",
        display: "visible" as const,
        index: 1,
        type: "custom" as const,
        userAdded: true,
      };

      const merged = service.mergeColumnSettings(defaultColumns, [
        { name: "pid", display: "visible", index: 0 },
        customColumn,
      ]);

      expect(merged).toEqual([
        jasmine.objectContaining({ name: "pid" }),
        customColumn,
        jasmine.objectContaining({ name: "size" }),
        jasmine.objectContaining({ name: "createdAt" }),
      ]);
    });

    it("drops unknown saved columns that are not marked as user-added", () => {
      const merged = service.mergeColumnSettings(defaultColumns, [
        { name: "pid", display: "visible", index: 0 },
        { name: "oldColumn", header: "Old", display: "visible", index: 1 },
      ]);

      expect(merged.some((column) => column.name === "oldColumn")).toBeFalse();
      expect(merged.map((column) => column.name)).toEqual([
        "pid",
        "size",
        "createdAt",
      ]);
    });
  });
});
