import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import {
  TableComponent,
  PageChangeEvent,
  SortChangeEvent
} from "./table.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  MatListModule,
  MatTableModule,
  MatPaginatorModule
} from "@angular/material";
import { PipesModule } from "shared/pipes/pipes.module";

describe("TableComponent", () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TableComponent],
      imports: [MatListModule, MatPaginatorModule, MatTableModule, PipesModule]
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onPageChange()", () => {
    it("should emit a PageChangeEvent", () => {
      spyOn(component.pageChange, "emit");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onPageChange(event);

      expect(component.pageChange.emit).toHaveBeenCalledTimes(1);
      expect(component.pageChange.emit).toHaveBeenCalledWith(event);
    });
  });

  describe("#onSortChange()", () => {
    it("should emit a SortChangeEvent", () => {
      spyOn(component.sortChange, "emit");

      const event: SortChangeEvent = {
        active: "test",
        direction: ""
      };
      component.onSortChange(event);

      expect(component.sortChange.emit).toHaveBeenCalledTimes(1);
      expect(component.sortChange.emit).toHaveBeenCalledWith(event);
    });
  });

  describe("#onRowClick()", () => {
    it("should emit the data in the selected row", () => {
      spyOn(component.rowClick, "emit");

      const data = {
        id: "123",
        name: "test"
      };
      component.onRowClick(data);

      expect(component.rowClick.emit).toHaveBeenCalledTimes(1);
      expect(component.rowClick.emit).toHaveBeenCalledWith(data);
    });
  });
});
