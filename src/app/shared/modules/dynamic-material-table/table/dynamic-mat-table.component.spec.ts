import { ChangeDetectorRef, Component, Renderer2 } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { StoreModule } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, EMPTY, of, Subject } from "rxjs";
import {
  Overlay,
  OverlayContainer,
  OverlayPositionBuilder,
} from "@angular/cdk/overlay";

import { DynamicMatTableComponent } from "./dynamic-mat-table.component";
import { DynamicMatTableModule } from "./dynamic-mat-table.module";
import { ITableSetting } from "../models/table-setting.model";
import { ITableEvent, TableEventType } from "../models/table-row.model";
import { EventsService } from "shared/events.service";
import { TableService } from "./dynamic-mat-table.service";
import { TableField } from "../models/table-field.model";
import { AppConfigService } from "app-config.service";

describe("DynamicMatTableComponent", () => {
  let component: DynamicMatTableComponent<any>;

  const hoverColumn: TableField<any> = {
    name: "scientificMetadata",
    header: "Scientific metadata",
    hoverContent: true,
    type: "hoverContent",
  };

  beforeEach(() => {
    const overlayContainer = {
      getContainerElement: () => document.createElement("div"),
    } as unknown as OverlayContainer;

    component = new DynamicMatTableComponent<any>(
      {} as MatDialog,
      {} as Renderer2,
      new TableService(),
      {
        detectChanges: () => undefined,
      } as ChangeDetectorRef,
      {} as Overlay,
      overlayContainer,
      {} as OverlayPositionBuilder,
      {},
      new DatePipe("en-US"),
      {
        getConfig: () => ({}),
      } as AppConfigService,
      {} as any,
    );
  });

  it("pins the hover card and stops click propagation", () => {
    const event = jasmine.createSpyObj<MouseEvent>("event", [
      "stopPropagation",
      "preventDefault",
    ]);
    const row = { id: 1 };

    component.togglePinnedHoverCard(event, row, hoverColumn);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.isHoverCardPinned(row, hoverColumn)).toBeTrue();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeTrue();
  });

  it("closes a pinned hover card when toggled again", () => {
    const row = { id: 1 };
    const event = jasmine.createSpyObj<MouseEvent>("event", [
      "stopPropagation",
      "preventDefault",
    ]);

    component.togglePinnedHoverCard(event, row, hoverColumn);
    component.togglePinnedHoverCard(event, row, hoverColumn);

    expect(component.isHoverCardPinned(row, hoverColumn)).toBeFalse();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeFalse();
  });

  it("does not open a second hover card while another one is pinned", () => {
    const row = { id: 1 };
    const otherRow = { id: 2 };

    component.pinnedHoverKey = component.makeKey(row, hoverColumn);
    component.onHoverCardTriggerEnter(otherRow, hoverColumn);

    expect(component.hoverKey).toBeNull();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeTrue();
    expect(component.isHoverCardOpen(otherRow, hoverColumn)).toBeFalse();
  });

  it("keeps a pinned hover card open after mouseleave until explicitly closed", () => {
    const row = { id: 1 };

    component.pinnedHoverKey = component.makeKey(row, hoverColumn);
    component.hoverKey = component.makeKey(row, hoverColumn);

    component.onHoverCardTriggerLeave(row, hoverColumn);

    expect(component.isHoverCardOpen(row, hoverColumn)).toBeTrue();

    component.closePinnedHoverCard();

    expect(component.isHoverCardOpen(row, hoverColumn)).toBeFalse();
  });

  it("opens the thumbnail preview on mouseenter and closes it on mouseleave", () => {
    const row = { id: 1, pid: "pid-1" };
    const imageColumn: TableField<any> = { name: "image", renderImage: true };

    component.onHoverCardTriggerEnter(row, imageColumn);
    expect(component.isHoverCardOpen(row, imageColumn)).toBeTrue();

    component.onHoverCardTriggerLeave(row, imageColumn);
    expect(component.isHoverCardOpen(row, imageColumn)).toBeFalse();
  });

  it("shows the preview of one row at a time", () => {
    const row = { id: 1, pid: "pid-1" };
    const otherRow = { id: 2, pid: "pid-2" };
    const imageColumn: TableField<any> = { name: "image", renderImage: true };

    component.onHoverCardTriggerEnter(row, imageColumn);
    component.onHoverCardTriggerEnter(otherRow, imageColumn);

    expect(component.isHoverCardOpen(row, imageColumn)).toBeFalse();
    expect(component.isHoverCardOpen(otherRow, imageColumn)).toBeTrue();
  });

  const initDataSource = () => {
    component.tableSetting = {};
    component.paginator = {
      page: new Subject(),
      initialized: of(undefined),
    } as unknown as MatPaginator;
    component.sort = {
      sortChange: new Subject(),
      initialized: of(undefined),
    } as unknown as MatSort;
    component.dataSource = new BehaviorSubject<any[]>([]);
    spyOn(component, "refreshUI");
    component.ngAfterViewInit();
  };

  it("clears the hover state when the data changes", () => {
    const row = { id: 1, pid: "pid-1" };
    const imageColumn: TableField<any> = { name: "image", renderImage: true };
    initDataSource();

    component.onHoverCardTriggerEnter(row, imageColumn);
    expect(component.isHoverCardOpen(row, imageColumn)).toBeTrue();

    component.dataSource.next([{ pid: "pid-2" }]);

    expect(component.isHoverCardOpen(row, imageColumn)).toBeFalse();
  });

  it("keeps a pinned hover card open when the data changes", () => {
    const row = { id: 1 };
    const event = jasmine.createSpyObj<MouseEvent>("event", [
      "stopPropagation",
      "preventDefault",
    ]);
    initDataSource();

    component.togglePinnedHoverCard(event, row, hoverColumn);
    component.dataSource.next([{ pid: "pid-2" }]);

    expect(component.isHoverCardPinned(row, hoverColumn)).toBeTrue();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeTrue();
  });

  it("closes a pinned hover card on document click", () => {
    const row = { id: 1 };

    component.pinnedHoverKey = component.makeKey(row, hoverColumn);
    component.hoverKey = component.makeKey(row, hoverColumn);

    component.onDocumentClick();

    expect(component.isHoverCardPinned(row, hoverColumn)).toBeFalse();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeFalse();
  });

  it("detects scientific metadata content for tree rendering", () => {
    const row = {
      scientificMetadata: {
        nested: {
          value: 42,
        },
      },
    };

    expect(component.isScientificMetadataColumn(hoverColumn)).toBeTrue();
    expect(component.hasScientificMetadata(row)).toBeTrue();
    expect(component.getScientificMetadata(row)).toEqual(
      row.scientificMetadata,
    );
  });

  it("detects nested scientific metadata hover columns and returns only that subtree", () => {
    const nestedHoverColumn: TableField<any> = {
      name: "scientificMetadata.my-group",
      header: "Metadata",
      hoverContent: true,
      type: "hoverContent",
    };
    const row = {
      scientificMetadata: {
        "my-group": {
          nested: {
            value: 42,
          },
        },
        other: {
          value: "not shown",
        },
      },
    };

    expect(component.isScientificMetadataColumn(nestedHoverColumn)).toBeTrue();
    expect(component.hasScientificMetadata(row, nestedHoverColumn)).toBeTrue();
    expect(component.getScientificMetadata(row, nestedHoverColumn)).toEqual(
      row.scientificMetadata["my-group"],
    );
  });

  it("treats missing nested scientific metadata hover content as empty", () => {
    const nestedHoverColumn: TableField<any> = {
      name: "scientificMetadata.my-group",
      header: "Metadata",
      hoverContent: true,
      type: "hoverContent",
    };
    const row = {
      scientificMetadata: {
        other: {
          value: "not shown",
        },
      },
    };

    expect(component.hasScientificMetadata(row, nestedHoverColumn)).toBeFalse();
    expect(
      component.getScientificMetadata(row, nestedHoverColumn),
    ).toBeUndefined();
  });
});

@Component({
  template: `<dynamic-mat-table
    tableName="sortTestTable"
    pagingMode="server-side"
    [columns]="columns"
    [setting]="setting"
    [dataSource]="dataSource"
    [pagination]="pagination"
    (onTableEvent)="events.push($event)"
  ></dynamic-mat-table>`,
  standalone: false,
})
class SortHostComponent {
  columns: TableField<any>[] = [
    { name: "datasetName", header: "Dataset Name" },
    { name: "creationTime", header: "Creation Time" },
  ];
  setting: ITableSetting = {
    tableSort: { sortColumn: "creationTime", sortDirection: "desc" },
  };
  dataSource = new BehaviorSubject<any[]>([
    { datasetName: "a", creationTime: "2026-01-01" },
  ]);
  pagination = { pageIndex: 0, pageSize: 10, length: 1 };
  events: ITableEvent[] = [];
}

describe("DynamicMatTableComponent sort header", () => {
  let fixture: ComponentFixture<SortHostComponent>;
  let host: SortHostComponent;

  const matSort = () =>
    fixture.debugElement.query(By.directive(MatSort)).injector.get(MatSort);
  const sortEvents = () =>
    host.events.filter((e) => e.event === TableEventType.SortChanged);
  const sortedHeaders = () =>
    fixture.debugElement
      .queryAll(By.css("[mat-sort-header]"))
      .map((header) => header.nativeElement as HTMLElement)
      .filter((header) => header.getAttribute("aria-sort") !== "none")
      .map((header) => ({
        header: header.textContent.trim(),
        sort: header.getAttribute("aria-sort"),
      }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortHostComponent],
      imports: [
        DynamicMatTableModule.forRoot({}),
        NoopAnimationsModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        DatePipe,
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
        { provide: AppConfigService, useValue: { getConfig: () => ({}) } },
        {
          provide: EventsService,
          useValue: {
            connectionError$: of(false),
            evicted$: of(false),
            message$: EMPTY,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(SortHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("shows the sort of the setting when the table is created", () => {
    expect(matSort().active).toBe("creationTime");
    expect(matSort().direction).toBe("desc");
    expect(sortedHeaders()).toEqual([
      { header: "Creation Time", sort: "descending" },
    ]);
    expect(sortEvents()).toEqual([]);
  });

  it("follows the sort of the setting when it changes later", () => {
    host.setting = {
      ...host.setting,
      tableSort: { sortColumn: "datasetName", sortDirection: "asc" },
    };
    fixture.detectChanges();

    expect(matSort().active).toBe("datasetName");
    expect(matSort().direction).toBe("asc");
    expect(sortedHeaders()).toEqual([
      { header: "Dataset Name", sort: "ascending" },
    ]);
    // only a click of the user is a sort event
    expect(sortEvents()).toEqual([]);
  });

  it("emits a sort event when a header is clicked", () => {
    const header = fixture.debugElement
      .queryAll(By.css("[mat-sort-header]"))
      .find((h) => h.nativeElement.textContent.trim() === "Dataset Name");

    header.nativeElement.click();
    fixture.detectChanges();

    expect(sortEvents().length).toBe(1);
    expect(sortEvents()[0].sender).toEqual({
      active: "datasetName",
      direction: "asc",
    });
  });
});
