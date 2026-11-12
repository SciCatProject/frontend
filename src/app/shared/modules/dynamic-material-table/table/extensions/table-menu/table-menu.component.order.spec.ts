import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateService } from "@ngx-translate/core";
import { TableMenuComponent } from "./table-menu.component";
import { TableMenuModule } from "./table-menu.module";
import { TableMenuAction } from "shared/modules/dynamic-material-table/models/table-menu.model";
import { ITableSetting } from "../../../models/table-setting.model";

function makeSetting() {
  const setting: ITableSetting = {
    direction: "ltr",
    settingList: [],
    columnSetting: [
      { name: "pid", display: "visible" },
      { name: "name", display: "visible" },
      { name: "type", display: "visible" },
    ],
  } as any;
  return setting;
}

describe("TableMenuComponent popup auto-save", () => {
  let fixture: ComponentFixture<TableMenuComponent>;
  let component: TableMenuComponent;
  let setting: ITableSetting;
  let emitted: any[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableMenuModule, NoopAnimationsModule],
      providers: [
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string) => key,
            get: () => undefined,
            onLangChange: { subscribe: () => undefined },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableMenuComponent);
    component = fixture.componentInstance;
    setting = makeSetting();
    emitted = [];
    component.menuActionChange.subscribe((e) => emitted.push(e));
    component.tableSetting = setting;
    fixture.detectChanges();
  });

  it("drag in popup mutates the shared setting columnSetting", () => {
    component.columnMenuDropped({
      item: { data: { columnIndex: 1 } },
      currentIndex: 0,
    } as any);

    expect(setting.columnSetting.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
  });

  it("auto-saves the reordered setting after 500ms debounce", fakeAsync(() => {
    component.columnMenuDropped({
      item: { data: { columnIndex: 1 } },
      currentIndex: 0,
    } as any);

    tick(499);
    expect(emitted.length).toBe(0);

    tick(1);
    expect(emitted.length).toBe(1);
    expect(emitted[0].type).toBe(TableMenuAction.TableSetting);
    expect(emitted[0].data.columnSetting.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
    expect(emitted[0].data).toBe(setting);
  }));

  it("auto-saves a checkbox toggle after 500ms debounce", fakeAsync(() => {
    component.toggleSelectedColumn(setting.columnSetting[2]);

    tick(499);
    expect(emitted.length).toBe(0);

    tick(1);
    expect(emitted.length).toBe(1);
    expect(emitted[0].type).toBe(TableMenuAction.TableSetting);
  }));

  it("collapses rapid drag + toggle into a single save", fakeAsync(() => {
    component.columnMenuDropped({
      item: { data: { columnIndex: 1 } },
      currentIndex: 0,
    } as any);
    tick(200);
    component.toggleSelectedColumn(setting.columnSetting[0]);

    tick(499);
    expect(emitted.length).toBe(0);

    tick(1);
    expect(emitted.length).toBe(1);
  }));

  it("auto-saves a gear sub-menu change after 500ms debounce", fakeAsync(() => {
    component.onColumnSettingChange();

    tick(499);
    expect(emitted.length).toBe(0);

    tick(1);
    expect(emitted.length).toBe(1);
    expect(emitted[0].type).toBe(TableMenuAction.TableSetting);
  }));
});
