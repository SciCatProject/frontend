import { DynamicMatTableComponent } from "./dynamic-mat-table.component";
import { TableSetting } from "../models/table-setting.model";
import { TableField } from "../models/table-field.model";
import { TableMenuAction } from "../models/table-menu.model";

function cols(...names: string[]): TableField<any>[] {
  return names.map(
    (name) =>
      ({
        name,
        header: name,
        display: "visible",
        filter: "client-side",
        sort: "client-side",
        sticky: "none",
        printable: true,
        exportable: true,
        enableContextMenu: true,
        toExport: () => "",
        toPrint: () => "",
      }) as any,
  );
}

function createComponent(): any {
  const cdr = { detectChanges: () => undefined } as any;
  const dialog = {} as any;
  const renderer = {} as any;
  const tableService = { some: true } as any;
  const overlay = {} as any;
  const overlayContainer = {
    getContainerElement: () => ({ addEventListener: () => undefined }),
  } as any;
  const overlayPositionBuilder = {} as any;
  const config = new TableSetting();
  const datePipe = { transform: (v: any) => v } as any;
  const appConfigService = { getConfig: () => ({}) } as any;
  const eventsService = {
    message$: { subscribe: () => undefined },
    latestUpdatedId$: { subscribe: () => undefined },
    connectionError$: { subscribe: () => undefined },
  } as any;

  return new (DynamicMatTableComponent as any)(
    dialog,
    renderer,
    tableService,
    cdr,
    overlay,
    overlayContainer,
    overlayPositionBuilder,
    config,
    datePipe,
    appConfigService,
    eventsService,
  );
}

describe("DynamicMatTableComponent popup drag + apply (direct)", () => {
  let component: any;

  beforeEach(() => {
    component = createComponent();
    component.tableContainer = { nativeElement: { scrollTop: 0 } };
    component.setting = {
      direction: "ltr",
      settingList: [],
      visibleActionMenu: {},
      columnSetting: cols("pid", "name", "type"),
    };
    component.columns = cols("pid", "name", "type");
  });

  it("applying a dragged popup order reorders the table columns", () => {
    const cs = component.setting.columnSetting;
    cs.splice(0, 0, cs.splice(1, 1)[0]);
    expect(cs.map((c: any) => c.name)).toEqual(["name", "pid", "type"]);

    component.tableMenuActionChange({
      type: TableMenuAction.TableSetting,
      data: component.setting,
    });

    expect(component.columns.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
    expect(component.setting.columnSetting.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
  });

  it("visibility-only toggle keeps table and popup in sync", () => {
    const cs = component.setting.columnSetting;
    cs.find((c: any) => c.name === "type").display = "hidden";

    component.tableMenuActionChange({
      type: TableMenuAction.TableSetting,
      data: component.setting,
    });

    expect(
      component.setting.columnSetting.find((c: any) => c.name === "type")
        .display,
    ).toBe("hidden");
    expect(
      component.columns.find((c: any) => c.name === "type").display,
    ).toBe("hidden");
  });
});
