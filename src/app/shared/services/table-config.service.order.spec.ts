import { TableConfigService } from "./table-config.service";
import { TableSettingsStorageService } from "./table-settings-storage.service";
import { TableField } from "../modules/dynamic-material-table/models/table-field.model";

function cols(...names: string[]): TableField<any>[] {
  return names.map((name) => ({ name, display: "visible" }) as any);
}

describe("TableConfigService order preservation", () => {
  let service: TableConfigService;
  let storage: TableSettingsStorageService;

  beforeEach(() => {
    storage = new TableSettingsStorageService();
    localStorage.clear();
    service = new TableConfigService(storage);
  });

  it("getTableSettingsConfig keeps the saved (reordered) column order", () => {
    const defaults = {
      settingList: [
        {
          settingName: "default",
          isDefaultSetting: true,
          isCurrentSetting: true,
          columnSetting: cols("pid", "name", "type"),
        },
      ],
    } as any;

    // saved config with "name" moved to the front (as persisted after a drag+apply)
    const saved = cols("name", "pid", "type");

    const config = service.getTableSettingsConfig(
      "datasetTable",
      defaults,
      saved,
    );

    const current = config.settingList.find((s) => s.isCurrentSetting);
    expect(current.columnSetting.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
  });

  it("prefers persisted storage columns over passed-in columns", () => {
    storage.set("datasetTable", cols("name", "pid", "type"));
    const storeCols = cols("pid", "name", "type");

    const result = service.preferSavedColumns("datasetTable", storeCols);
    expect(result.map((c: any) => c.name)).toEqual(["name", "pid", "type"]);
  });
});
