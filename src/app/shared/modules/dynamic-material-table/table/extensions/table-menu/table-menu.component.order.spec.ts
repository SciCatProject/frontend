import { ComponentFixture, TestBed } from "@angular/core/testing";
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

describe("TableMenuComponent popup drag/apply", () => {
  let fixture: ComponentFixture<TableMenuComponent>;
  let component: TableMenuComponent;
  let setting: ITableSetting;

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

  it("apply emits the reordered setting", () => {
    let emitted: any;
    component.menuActionChange.subscribe((e) => (emitted = e));

    component.columnMenuDropped({
      item: { data: { columnIndex: 1 } },
      currentIndex: 0,
    } as any);

    component.apply_onClick({
      stopPropagation: () => undefined,
      preventDefault: () => undefined,
    } as any);

    expect(emitted.type).toBe(TableMenuAction.TableSetting);
    expect(emitted.data.columnSetting.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
    expect(emitted.data).toBe(setting);
  });
});
