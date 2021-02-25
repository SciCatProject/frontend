import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { of } from "rxjs";
import { SciCatDataSource } from "shared/services/scicat.datasource";

import { SharedTableComponent } from "./shared-table.component";

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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SharedTableComponent],
    }).compileComponents();
  }));

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
});
