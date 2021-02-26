import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DatePipe } from "@angular/common";
import {
  TableComponent,
  PageChangeEvent,
  SortChangeEvent,
  CheckboxEvent
} from "./table.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { PipesModule } from "../../pipes/pipes.module";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxChange } from "@angular/material/checkbox";

describe("TableComponent", () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TableComponent],
      imports: [MatListModule, MatPaginatorModule, MatTableModule, PipesModule],
      providers: [DatePipe]
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

  describe("#onSelectAll()", () => {
    it("should emit a MatCheckboxChange event", () => {
      spyOn(component.selectAll, "emit");

      const event = new MatCheckboxChange();
      component.onSelectAll(event);

      expect(component.selectAll.emit).toHaveBeenCalledTimes(1);
      expect(component.selectAll.emit).toHaveBeenCalledWith(event);
    });
  });

  describe("#onSelectOne()", () => {
    it("should emit a CheckboxEvent", () => {
      spyOn(component.selectOne, "emit");

      const selectEvent: CheckboxEvent = {
        event: new MatCheckboxChange(),
        row: {}
      };
      component.onSelectOne(selectEvent.event, selectEvent.row);

      expect(component.selectOne.emit).toHaveBeenCalledTimes(1);
      expect(component.selectOne.emit).toHaveBeenCalledWith(selectEvent);
    });
  });

  describe("#isAllSelected()", () => {
    it("should return false if length of data array and length of selected array are not equal", () => {
      component.data = ["test1", "test2"];

      const allSelected = component.isAllSelected();

      expect(allSelected).toEqual(false);
    });

    it("should return true if length of data array and length of selected array are equal", () => {
      const allSelected = component.isAllSelected();

      expect(allSelected).toEqual(true);
    });
  });
});
