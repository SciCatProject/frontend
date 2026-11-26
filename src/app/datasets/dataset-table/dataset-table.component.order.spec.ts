import { DatasetTableComponent } from "./dataset-table.component";
import { TableConfigService } from "shared/services/table-config.service";
import { TableSettingsStorageService } from "shared/services/table-settings-storage.service";
import { TableSettingEventType } from "shared/modules/dynamic-material-table/models/table-setting.model";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";

function cols(...names: string[]): TableField<any>[] {
  return names.map(
    (name) =>
      ({
        name,
        header: name,
        display: "visible",
        type: "standard",
        width: 100,
      }) as any,
  );
}

describe("DatasetTableComponent order round-trip", () => {
  let component: any;
  let dispatched: any[];
  let storage: TableSettingsStorageService;
  let configService: TableConfigService;

  beforeEach(() => {
    localStorage.clear();
    storage = new TableSettingsStorageService();
    configService = new TableConfigService(storage);
    dispatched = [];

    const store = {
      dispatch: (a: any) => dispatched.push(a),
      select: () => ({ subscribe: () => undefined }),
      pipe: () => ({ subscribe: () => undefined }),
    } as any;

    const datasetsListService = {
      convertSavedDatasetColumns: (columns: any[]) =>
        columns.map((c) => ({
          name: c.name,
          display: c.enabled ? "visible" : "hidden",
          index: c.order,
        })),
    } as any;

    component = new (DatasetTableComponent as any)(
      {
        getConfig: () => ({
          defaultDatasetsListSettings: { columns: [] },
        }),
      } as any,
      store,
      {} as any,
      configService,
      datasetsListService,
      {} as any,
      storage,
    );

    component.tableName = "datasetTable";
    component.tableDefaultSettingsConfig = {
      settingList: [
        {
          settingName: "default",
          isDefaultSetting: true,
          isCurrentSetting: true,
          columnSetting: cols("pid", "name", "type"),
        },
      ],
    };
  });

  it("saveTableSettings preserves the given column order", () => {
    component.saveTableSettings({
      columnSetting: cols("name", "pid", "type"),
    } as any);

    const columnsAction = dispatched.find((a: any) => a.columns);
    expect(columnsAction.columns.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
    expect(
      (storage.get("datasetTable", undefined) as any[]).map((c: any) => c.name),
    ).toEqual(["name", "pid", "type"]);
  });

  it("apply persists the reordered columns and re-init keeps the order", () => {
    // initial state matching the default order
    const initialConfig = configService.getTableSettingsConfig(
      "datasetTable",
      component.tableDefaultSettingsConfig,
      cols("pid", "name", "type"),
    );
    component.initTable(initialConfig, {});
    expect(component.columns.map((c: any) => c.name)).toEqual([
      "pid",
      "name",
      "type",
    ]);

    // the directive keeps columnSetting at the top level of the setting object
    component.setting.columnSetting = component.columns.slice();

    // user drags "name" to the front in the popup
    component.setting.columnSetting = [
      component.setting.columnSetting[1],
      component.setting.columnSetting[0],
      component.setting.columnSetting[2],
    ];
    expect(component.setting.columnSetting.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);

    // click apply
    component.onSettingChange({
      type: TableSettingEventType.apply,
      setting: component.setting,
    });
    const dispatchedNames = (dispatched[0]?.columns || []).map(
      (c: any) => c.name,
    );
    const persisted = (storage.get("datasetTable", undefined) as any[]).map(
      (c: any) => c.name,
    );

    // simulate the parent re-init after the store update
    const saved = configService.preferSavedColumns(
      "datasetTable",
      cols("pid", "name", "type"),
    );
    const reconfig = configService.getTableSettingsConfig(
      "datasetTable",
      component.tableDefaultSettingsConfig,
      saved,
    );
    component.initTable(reconfig, {});
    const finalColumns = component.columns.map((c: any) => c.name);

    expect(finalColumns).toEqual(["name", "pid", "type"]);
    expect(dispatched.length).toBe(2);
    expect(dispatched[0].type).toBe("[User] Set Table Columns");
    expect(dispatchedNames).toEqual(["name", "pid", "type"]);
    expect(persisted).toEqual(["name", "pid", "type"]);
  });
});
