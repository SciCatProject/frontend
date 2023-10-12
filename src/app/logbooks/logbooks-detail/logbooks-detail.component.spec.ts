import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { LogbooksDetailComponent } from "./logbooks-detail.component";
import { LinkyModule } from "ngx-linky";
import {
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDividerModule } from "@angular/material/divider";
import { MatPaginatorModule } from "@angular/material/paginator";

describe("LogbooksDetailComponent", () => {
  let component: LogbooksDetailComponent;
  let fixture: ComponentFixture<LogbooksDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatCardModule,
        MatDividerModule,
        MatExpansionModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        LinkyModule,
      ],
      declarations: [LogbooksDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#doPageChange()", () => {
    it("should emit a PageChangeEvent", () => {
      const emitSpy = spyOn(component.pageChange, "emit");

      const event: PageChangeEvent = {
        pageIndex: 1,
        pageSize: 25,
        length: 100,
      };

      component.doPageChange(event);

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });

  describe("#doSortChange()", () => {
    it("should emit a SortChangeEvent", () => {
      const emitSpy = spyOn(component.sortChange, "emit");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc",
      };

      component.doSortChange(event);

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });
});
