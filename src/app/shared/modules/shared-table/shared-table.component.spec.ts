import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { of } from "rxjs";
import { SciCatDataSource } from "shared/services/scicat.datasource";

import { SharedTableComponent } from "./shared-table.component";
import { RouterTestingModule } from "@angular/router/testing";

describe("SharedTableComponent", () => {
  let component: SharedTableComponent;
  let fixture: ComponentFixture<SharedTableComponent>;

  const dataSource = {
    loadAllData: () => {},
    loadExportData: () => {},
  } as SciCatDataSource;

  // const dataTable = jasmine.createSpyObj("MatTable", ["_elementRef"]);
  const dataTable = ({
    _elementRef: {
      nativeElement: {
        clientWidth: 0,
      },
    },
  } as unknown) as MatTable<Element>;

  const columnsDef = [];

  const paginator = {
    page: of({}),
  } as MatPaginator;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [SharedTableComponent],
      }).compileComponents();
    })
  );

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
        component.input.nativeElement.value,
        component.filterExpressions,
        component.sort.active,
        component.sort.direction
      );
    });
  });

  describe("#loadDataPage()", () => {
    it("should call loadAllData in dataSource", () => {
      const loadSpy = spyOn(component.dataSource, "loadAllData");

      component.loadDataPage();

      expect(loadSpy).toHaveBeenCalledOnceWith(
        component.input.nativeElement.value,
        component.filterExpressions,
        component.sort.active,
        component.sort.direction,
        component.paginator.pageIndex,
        component.paginator.pageSize
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

  describe("#getExpandFlag()", () => {
    xit("should ...", () => {});
  });

  describe("#toggleExpandFlag()", () => {
    xit("should ...", () => {});
  });

  describe("#activateColumnFilters()", () => {
    xit("should ...", () => {});
  });

  describe("#reloadFilterExpressions()", () => {
    xit("should ...", () => {});
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

  describe("#dateChanged()", () => {
    xit("should ...", () => {});
  });
});
