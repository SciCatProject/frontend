import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { InstrumentsDashboardComponent } from "./instruments-dashboard.component";
import { MockActivatedRoute, mockInstrument } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { selectInstrumentsWithCountAndTableSettings } from "state-management/selectors/instruments.selectors";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { SortChangeEvent } from "shared/modules/table/table.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import {
  RowEventType,
  TableEventType,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { TablePagination } from "shared/modules/dynamic-material-table/models/table-pagination.model";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("InstrumentsDashboardComponent", () => {
  let component: InstrumentsDashboardComponent;
  let fixture: ComponentFixture<InstrumentsDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    navigate: jasmine.createSpy("navigate"),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InstrumentsDashboardComponent],
      imports: [
        FlexLayoutModule,
        SharedScicatFrontendModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectInstrumentsWithCountAndTableSettings,
              value: {
                instruments: [],
                count: 100,
                tableSettings: {},
              },
            },
          ],
        }),
      ],
    });
    TestBed.overrideComponent(InstrumentsDashboardComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onPageChange()", () => {
    it("should dispatch a fetchInstrumentsAction", () => {
      router.navigate.calls.reset();
      const event: TablePagination = {
        pageIndex: 0,
        pageSize: 25,
        length: 100,
      };

      const { pageIndex, pageSize } = event;

      component.onPaginationChange(event);

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: {
          pageIndex,
          pageSize,
        },
        queryParamsHandling: "merge",
      });
    });
  });

  describe("#onTableEvent()", () => {
    it("should dispatch a fetchInstrumentsAction", () => {
      router.navigate.calls.reset();
      const event: SortChangeEvent = {
        active: "test",
        direction: "asc",
      };

      const { active: sortColumn, direction: sortDirection } = event;

      component.onTableEvent({
        event: TableEventType.SortChanged,
        sender: event,
      });

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: {
          pageIndex: 0,
          sortDirection: sortDirection || undefined,
          sortColumn: sortDirection ? sortColumn : undefined,
        },
        queryParamsHandling: "merge",
      });
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to an instrument", () => {
      const instrument = mockInstrument;
      const pid = encodeURIComponent(instrument.pid);

      component.onRowClick({
        event: RowEventType.RowClick,
        sender: { row: instrument },
      });

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith("/instruments/" + pid);
    });
  });
});
