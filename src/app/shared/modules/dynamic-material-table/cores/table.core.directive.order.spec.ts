import { TableCoreDirective } from "./table.core.directive";
import { TableSetting } from "../models/table-setting.model";
import { TableField } from "../models/table-field.model";
import { TableRow } from "../models/table-row.model";

interface Col extends TableField<any> {
  name: string;
}

function cols(...names: string[]): Col[] {
  return names.map((name) => ({ name }) as Col);
}

describe("TableCoreDirective column order sync", () => {
  let directive: any;

  beforeEach(() => {
    directive = new TableCoreDirective(
      {} as any,
      { detectChanges: () => undefined } as any,
      new TableSetting(),
    );
    // stub view refs used by refreshColumn
    directive.tableContainer = { nativeElement: { scrollTop: 0 } };
  });

  it("applyColumnSettingOrder reorders table columns to the popup order", () => {
    directive.columns = cols("pid", "name", "type");
    // popup order: name moved to front
    directive.tableSetting.columnSetting = cols("name", "pid", "type");

    directive.applyColumnSettingOrder();

    expect(directive.columns.map((c: Col) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
    expect(
      directive.tableSetting.columnSetting.map((c: Col) => c.name),
    ).toEqual(["name", "pid", "type"]);
  });

  it("syncColumnSettingOrder reorders popup to match table order", () => {
    directive.columns = cols("name", "type", "pid");
    directive.tableSetting.columnSetting = cols("pid", "name", "type");

    directive.syncColumnSettingOrder();

    expect(
      directive.tableSetting.columnSetting.map((c: Col) => c.name),
    ).toEqual(["name", "type", "pid"]);
  });

  it("refreshColumn keeps popup order in sync with the table", () => {
    directive.columns = cols("name", "type", "pid");
    directive.tableSetting.columnSetting = cols("pid", "name", "type");

    // simulate a table reorder: move pid to the end already reflected in columns
    directive.refreshColumn(cols("name", "type", "pid"));

    expect(
      directive.tableSetting.columnSetting.map((c: Col) => c.name),
    ).toEqual(["name", "type", "pid"]);
  });

  it("full popup drag + apply keeps table and popup identical", () => {
    directive.columns = cols("pid", "name", "type");
    directive.tableSetting.columnSetting = cols("pid", "name", "type");

    // user drags "name" to the top in the popup
    const setting = directive.tableSetting.columnSetting;
    setting.splice(0, 0, setting.splice(1, 1)[0]);

    // apply
    directive.applyColumnSettingOrder();
    directive.refreshColumn(directive.tableSetting.columnSetting);

    expect(directive.columns.map((c: Col) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
    expect(
      directive.tableSetting.columnSetting.map((c: Col) => c.name),
    ).toEqual(["name", "pid", "type"]);
  });
});
