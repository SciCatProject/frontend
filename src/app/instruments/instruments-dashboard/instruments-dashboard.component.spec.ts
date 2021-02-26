import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";

import { InstrumentsDashboardComponent } from "./instruments-dashboard.component";
import { MockStore } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import {
  getInstruments,
  getPage,
  getInstrumentsCount,
  getInstrumentsPerPage
} from "state-management/selectors/instruments.selectors";
import { Store } from "@ngrx/store";
import { SharedCatanieModule } from "shared/shared.module";
import { JsonHeadPipe } from "shared/pipes/json-head.pipe";
import {
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import {
  changePageAction,
  sortByColumnAction
} from "state-management/actions/instruments.actions";
import { Router } from "@angular/router";
import { Instrument } from "shared/sdk";

describe("InstrumentsDashboardComponent", () => {
  let component: InstrumentsDashboardComponent;
  let fixture: ComponentFixture<InstrumentsDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InstrumentsDashboardComponent],
      imports: [SharedCatanieModule],
      providers: [
        JsonHeadPipe,
        provideMockStore({
          selectors: [
            { selector: getInstruments, value: [] },
            { selector: getPage, value: 0 },
            { selector: getInstrumentsCount, value: 100 },
            { selector: getInstrumentsPerPage, value: 25 }
          ]
        })
      ]
    });
    TestBed.overrideComponent(InstrumentsDashboardComponent, {
      set: {
        providers: [{ provide: Router, useValue: router }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 100
      };

      const { pageIndex: page, pageSize: limit } = event;

      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page, limit })
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a sortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc"
      };

      const { active: column, direction } = event;

      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column, direction })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to an instrument", () => {
      const instrument = new Instrument();
      const pid = encodeURIComponent(instrument.pid);

      component.onRowClick(instrument);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith("/instruments/" + pid);
    });
  });
});
