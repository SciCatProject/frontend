import { DatePipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { AppConfigService } from "app-config.service";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import { JsonHeadPipe } from "shared/pipes/json-head.pipe";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { DatasetsListService, isMetadataGroup } from "./datasets-list.service";

describe("DatasetsListService CSV columns", () => {
  let service: DatasetsListService;
  const groupColumn: TableField<any> = {
    name: "scientificMetadata.group",
    header: "Group",
    display: "visible",
  };

  beforeEach(() => {
    const store = jasmine.createSpyObj<Store>("Store", ["select"]);
    store.select.and.returnValue(of([]));
    const config = {
      getConfig: () => ({ metadataFloatFormatEnabled: false }),
    } as AppConfigService;
    service = new DatasetsListService(
      store,
      new DatePipe("en"),
      new FileSizePipe(),
      new JsonHeadPipe(),
      new FormatNumberPipe(config),
    );
  });

  afterEach(() => service.ngOnDestroy());

  it("excludes metadata previews and disabled export columns while preserving ordinary columns", () => {
    const pid: TableField<any> = { name: "pid", header: "PID" };
    const columns = service.prepareCsvExportColumns(
      [
        pid,
        { name: "scientificMetadata" },
        { name: "metadata" },
        { name: "hidden", display: "hidden" },
        { name: "disabled", exportable: false },
      ],
      [],
    );
    expect(columns).toEqual([pid]);
    expect(columns[0]).toBe(pid);
  });

  it("expands one level using members from every dataset, retaining column order", () => {
    const rows = [
      { scientificMetadata: { group: { field_A: 1 } } },
      { scientificMetadata: { group: { field_B: { value: 3, unit: "K" } } } },
      { scientificMetadata: { group: "scalar" } },
      {},
    ];
    const columns = service.prepareCsvExportColumns(
      [{ name: "pid" }, groupColumn, { name: "datasetName" }],
      rows,
    );
    expect(columns.map((column) => column.name)).toEqual([
      "pid",
      "scientificMetadata.group.field_A",
      "scientificMetadata.group.field_B",
      "datasetName",
    ]);
    expect(columns.slice(1, 3).map((column) => column.header)).toEqual([
      "group.field_A",
      "group.field_B",
    ]);
    expect(rows.map((row) => columns[1].toExport(row, "csv"))).toEqual([
      "1",
      "",
      "",
      "",
    ]);
    expect(rows.map((row) => columns[2].toExport(row, "csv"))).toEqual([
      "",
      "3 K",
      "",
      "",
    ]);
  });

  it("formats immediate values, preserving zero, false, arrays and blank nulls", () => {
    const row = {
      scientificMetadata: {
        group: { zero: 0, flag: false, list: [1, 2], missing: null },
      },
    };
    const columns = service.prepareCsvExportColumns([groupColumn], [row]);
    expect(columns.map((column) => column.toExport(row, "csv"))).toEqual([
      "0",
      "false",
      "1,2",
      "",
    ]);
  });

  it("omits empty groups and groups containing only deeper groups", () => {
    for (const group of [{}, { nested: { deeper: 1 } }]) {
      expect(
        service.prepareCsvExportColumns(
          [groupColumn],
          [{ scientificMetadata: { group } }],
        ),
      ).toEqual([]);
    }
  });

  it("preserves sort, printable and sticky when converting saved columns", () => {
    const [column] = service.convertSavedDatasetColumns([
      {
        name: "pid",
        header: "PID",
        order: 0,
        enabled: true,
        type: "standard",
        sort: "client-side",
        printable: false,
        sticky: "start",
      },
    ]);

    expect(column.sort).toBe("client-side");
    expect(column.printable).toBeFalse();
    expect(column.sticky).toBe("start");
  });
});
