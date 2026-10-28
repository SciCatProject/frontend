import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateService } from "@ngx-translate/core";
import { TableMenuComponent } from "./table-menu.component";
import { TableMenuModule } from "./table-menu.module";
import { TableMenuAction } from "shared/modules/dynamic-material-table/models/table-menu.model";
import { ITableSetting } from "../../../models/table-setting.model";

function makeSetting(): ITableSetting {
  return {
    direction: "ltr",
    settingList: [],
    visibleActionMenu: {},
    columnSetting: [
      { name: "pid", header: "PID", display: "visible" },
      { name: "name", header: "Name", display: "visible" },
      { name: "type", header: "Type", display: "visible" },
    ],
  } as any;
}

describe("TableMenuComponent DOM popup drag + apply", () => {
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

  function openColumnMenu() {
    const trigger = fixture.nativeElement.querySelector(
      ".main-menu",
    )?.parentElement as HTMLButtonElement;
    trigger?.click();
    fixture.detectChanges();
    // find the "Column setting" button and click it
    const buttons = Array.from(
      document.querySelectorAll("button.mat-mdc-menu-item"),
    ) as HTMLButtonElement[];
    const columnSettingBtn = buttons.find((b) =>
      b.textContent?.includes("Column setting"),
    );
    columnSettingBtn?.click();
    fixture.detectChanges();
  }

  it("clicking the real apply (done) button emits the reordered setting after a drag", () => {
    openColumnMenu();

    // perform the drag programmatically on the component (as cdk would)
    component.columnMenuDropped({
      item: { data: { columnIndex: 1 } },
      currentIndex: 0,
    } as any);

    let emitted: any;
    component.menuActionChange.subscribe((e) => (emitted = e));

    // click the real "done" (apply) button inside the open menu overlay
    const doneBtn = Array.from(
      document.querySelectorAll("button.done-setting"),
    ).find((b) => b.querySelector("mat-icon")?.textContent?.includes("done")) as
      | HTMLButtonElement
      | undefined;

    expect(doneBtn).toBeTruthy();
    doneBtn!.click();
    fixture.detectChanges();

    expect(emitted?.type).toBe(TableMenuAction.TableSetting);
    expect(emitted?.data.columnSetting.map((c: any) => c.name)).toEqual([
      "name",
      "pid",
      "type",
    ]);
  });
});
