/* eslint @typescript-eslint/no-empty-function:0 */

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { of } from "rxjs";

import { SharedTableComponent } from "./shared-table.component";
import { FormBuilder, FormControl } from "@angular/forms";
import { Column, SharedTableModule } from "./shared-table.module";
import { MockAppConfigService, MockScicatDataSource } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideLuxonDateAdapter } from "@angular/material-luxon-adapter";
import { provideRouter } from "@angular/router";

describe("SharedTableComponent", () => {
  let component: SharedTableComponent;
  let fixture: ComponentFixture<SharedTableComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SharedTableComponent],
      imports: [SharedTableModule, BrowserAnimationsModule],
      providers: [FormBuilder, provideLuxonDateAdapter(), provideRouter([])],
    }).compileComponents();
  }));

  const dataSource = new MockScicatDataSource(
    new MockAppConfigService(null) as unknown as AppConfigService,
    null,
    null,
    { collections: null, columns: null },
  );

  const dataTable = {
    _elementRef: {
      nativeElement: {
        clientWidth: 0,
      },
    },
  } as unknown as MatTable<Element>;

  const columnsDef: Column[] = [
    {
      id: "id",
      label: "ID",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "contains",
      hideOrder: 0,
    },
    {
      id: "creationTime",
      icon: "schedule",
      label: "Created at local time",
      format: "date medium ",
      canSort: true,
      matchMode: "between",
      hideOrder: 3,
      sortDefault: "desc",
    },
    {
      id: "jobResultObject",
      icon: "work_outline",
      label: "Result",
      format: "json",
      canSort: true,
      hideOrder: 7,
    },
  ];

  const paginator = {
    page: of({}),
  } as MatPaginator;

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTableComponent);
    component = fixture.componentInstance;
    component.dataSource = dataSource;
    component.dataTable = dataTable;
    component.columnsdef = columnsDef;
    component.sort = new MatSort();
    component.paginator = paginator;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#loadAllExportData()", () => {
    it("should call loadExportData in dataSource", () => {
      const loadSpy = spyOn(component.dataSource, "loadExportData");

      component.loadAllExportData();

      expect(loadSpy).toHaveBeenCalledOnceWith(
        component.filterExpressions,
        component.sort.active,
        component.sort.direction,
      );
    });
  });

  describe("#loadDataPage()", () => {
    it("should call loadAllData in dataSource", () => {
      const loadSpy = spyOn(component.dataSource, "loadAllData");

      component.loadDataPage();

      expect(loadSpy).toHaveBeenCalledOnceWith(
        component.filterExpressions,
        component.sort.active,
        component.sort.direction,
        component.paginator.pageIndex,
        component.paginator.pageSize,
        component.isFilesDashboard,
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should emit an event", () => {
      const rowClickSpy = spyOn(component.rowClick, "emit");

      const event = {
        value: "test",
      };
      component.onRowClick(event);

      expect(rowClickSpy).toHaveBeenCalledOnceWith(event);
    });
  });

  describe("#initilizeFormControl()", () => {
    it("should initialize form control", () => {
      const formControls = Object.keys(component.filterForm.controls);
      expect(formControls).toHaveSize(5);
      expect(formControls).toEqual([
        "id",
        "creationTime.start",
        "creationTime.end",
        "jobResultObject",
        "globalSearch",
      ]);
    });
  });

  describe("#toggleExpandFlag()", () => {
    xit("should ...", () => {});
  });

  describe("#activateColumnFilters()", () => {
    xit("should ...", () => {});
  });

  describe("#getExpandFlag()", () => {
    xit("should ...", () => {});
  });

  describe("#toggleExpandFlag()", () => {
    xit("should ...", () => {});
  });

  describe("#toggleHideFilterFlag()", () => {
    xit("should ...", () => {});
  });

  describe("#setDefaultFilters()", () => {
    xit("should ...", () => {});
  });

  describe("#resetFilters()", () => {
    it("should empty all filter inputs", () => {
      Object.values(component.filterForm.controls).forEach((xcontrol) => {
        const control = xcontrol as FormControl<string>;
        control.setValue("test");
      });
      component.resetFilters();
      Object.values(component.filterForm.controls).forEach((xcontrol) => {
        const control = xcontrol as FormControl<string>;
        expect(control.value).toEqual("");
      });
      expect(component.filterExpressions).toEqual({});
    });
  });

  describe("#toggleColumns()", () => {
    xit("should ...", () => {});
  });

  describe("#exportToExcel()", () => {
    xit("should ...", () => {});
  });

  describe("#getPropertyByPath()", () => {
    xit("should ...", () => {});
  });
  describe("#getFilterColumns()", () => {
    xit("should ...", () => {});
  });
});
