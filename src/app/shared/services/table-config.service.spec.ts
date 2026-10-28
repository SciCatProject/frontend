import { TestBed } from "@angular/core/testing";
import { TableConfigService } from "./table-config.service";
import { TableSettingsStorageService } from "./table-settings-storage.service";
import { ITableSetting } from "../modules/dynamic-material-table/models/table-setting.model";

describe("TableConfigService (fallback)", () => {
  let service: TableConfigService;
  let storage: jasmine.SpyObj<TableSettingsStorageService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj("TableSettingsStorageService", [
      "get",
      "set",
    ]);

    TestBed.configureTestingModule({
      providers: [
        TableConfigService,
        { provide: TableSettingsStorageService, useValue: storageSpy },
      ],
    });

    service = TestBed.inject(TableConfigService);
    storage = TestBed.inject(
      TableSettingsStorageService,
    ) as jasmine.SpyObj<TableSettingsStorageService>;
  });

  it("should use recovered savedTableConfig from storage when none provided", () => {
    const tableName = "datasetsTable";

    const savedColumns = [{ name: "pid", enabled: true, order: 0 }];

    storage.get.and.returnValue(savedColumns as any);

    const defaultSetting: ITableSetting = {
      settingList: [
        {
          columnSetting: [{ name: "PID" }],
          isDefaultSetting: true,
          isCurrentSetting: true,
        },
      ],
      rowStyle: {},
    } as any;

    const config = service.getTableSettingsConfig(
      tableName,
      defaultSetting,
      undefined,
    );

    expect(config).toBeTruthy();
    // find added setting by settingName
    const found = config.settingList.find(
      (s) => (s as any).settingName === tableName,
    );
    expect(found).toBeTruthy();
    // merged columnSetting should include our savedColumns (mapped)
    expect((found as any).columnSetting).toBeTruthy();
  });

  it("should pass the userId through to storage when recovering savedTableConfig", () => {
    const tableName = "datasetsTable";
    const userId = "some-user-id";

    const savedColumns = [{ name: "pid", enabled: true, order: 0 }];

    storage.get.and.returnValue(savedColumns as any);

    const defaultSetting: ITableSetting = {
      settingList: [
        {
          columnSetting: [{ name: "PID" }],
          isDefaultSetting: true,
          isCurrentSetting: true,
        },
      ],
      rowStyle: {},
    } as any;

    service.getTableSettingsConfig(
      tableName,
      defaultSetting,
      undefined,
      undefined,
      userId,
    );

    expect(storage.get).toHaveBeenCalledWith(tableName, userId);
  });

  it("should not consult storage when a savedTableConfig is provided", () => {
    const tableName = "datasetsTable";
    const userId = "some-user-id";

    const savedColumns = [{ name: "pid", enabled: true, order: 0 }];

    const defaultSetting: ITableSetting = {
      settingList: [
        {
          columnSetting: [{ name: "PID" }],
          isDefaultSetting: true,
          isCurrentSetting: true,
        },
      ],
      rowStyle: {},
    } as any;

    const config = service.getTableSettingsConfig(
      tableName,
      defaultSetting,
      savedColumns as any,
      undefined,
      userId,
    );

    expect(storage.get).not.toHaveBeenCalled();
    expect(config).toBeTruthy();
  });

  it("persistColumns should write to storage with tableName and userId", () => {
    const tableName = "jobsTable";
    const userId = "user-1";
    const columns = [{ name: "jobId", display: "visible", order: 0 }];

    service.persistColumns(tableName, columns, userId);

    expect(storage.set).toHaveBeenCalledWith(tableName, columns, userId);
  });

  it("preferSavedColumns should prefer persisted columns when storage has entries", () => {
    const tableName = "filesTable";
    const userId = "user-1";
    const persisted: any = [
      { name: "dataFileList.path", display: "hidden", order: 0 },
    ];
    storage.get.and.returnValue(persisted);

    const result = service.preferSavedColumns(
      tableName,
      [{ name: "userId", display: "visible", order: 0 }] as any,
      userId,
    );

    expect(storage.get).toHaveBeenCalledWith(tableName, userId);
    expect(result).toEqual(persisted);
  });

  it("preferSavedColumns should fall back to provided columns when storage is empty", () => {
    storage.get.and.returnValue(undefined);

    const columns: any = [{ name: "jobId", display: "visible", order: 0 }];

    const result = service.preferSavedColumns("jobsTable", columns);

    expect(result).toBe(columns);
  });

  describe("buildColumnsSetting", () => {
    it("builds persisted columns using array index as order and enabled from display", () => {
      const result = service.buildColumnsSetting([
        { name: "name", display: "visible", width: 100 },
        { name: "pid", display: "hidden", type: "standard" },
        { name: "type", display: "prevent-hidden" },
      ] as any);

      expect(result).toEqual([
        jasmine.objectContaining({
          name: "name",
          enabled: true,
          order: 0,
          width: 100,
        }),
        jasmine.objectContaining({
          name: "pid",
          enabled: false,
          order: 1,
          type: "standard",
        }),
        jasmine.objectContaining({
          name: "type",
          enabled: true,
          order: 2,
        }),
      ]);
    });

    it("maps printable and sticky through", () => {
      const result = service.buildColumnsSetting([
        { name: "name", display: "visible", printable: false, sticky: "start" },
      ] as any);

      expect(result[0]).toEqual(
        jasmine.objectContaining({
          name: "name",
          printable: false,
          sticky: "start",
        }),
      );
    });
  });

  describe("saveColumns", () => {
    it("builds the columns and persists them to storage", () => {
      const tableName = "jobsTable";
      const userId = "user-1";
      const columnSetting = [
        { name: "pid", display: "visible" },
        { name: "name", display: "hidden" },
      ] as any;

      const result = service.saveColumns(tableName, columnSetting, userId);

      expect(result.map((c) => c.name)).toEqual(["pid", "name"]);
      expect(storage.set).toHaveBeenCalledWith(tableName, result, userId);
    });
  });
});
