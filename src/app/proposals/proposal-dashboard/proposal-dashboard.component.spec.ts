import { APP_CONFIG } from "app-config.module";
import { MockStore, MockActivatedRoute } from "shared/MockStubs";
import { ProposalDashboardComponent } from "./proposal-dashboard.component";
import { Router, ActivatedRoute } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { DatePipe } from "@angular/common";
import { Proposal } from "shared/sdk";
import {
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import {
  changePageAction,
  sortByColumnAction,
  setTextFilterAction,
  fetchProposalsAction,
  clearFacetsAction,
  setDateRangeFilterAction,
} from "state-management/actions/proposals.actions";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { DateTime } from "luxon";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

describe("ProposalDashboardComponent", () => {
  let component: ProposalDashboardComponent;
  let fixture: ComponentFixture<ProposalDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ProposalDashboardComponent],
        imports: [
          FlexLayoutModule,
          MatCardModule,
          MatIconModule,
          SharedScicatFrontendModule,
          StoreModule.forRoot({}),
        ],
        providers: [DatePipe],
      });
      TestBed.overrideComponent(ProposalDashboardComponent, {
        set: {
          providers: [
            { provide: APP_CONFIG, useValue: { editSampleEnabled: true } },
            { provide: Router, useValue: router },
            { provide: ActivatedRoute, useClass: MockActivatedRoute },
          ],
        },
      });
      TestBed.compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDashboardComponent);
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

  describe("#formatTableData()", () => {
    it("should return empty array if there are no proposals", () => {
      const data = component.formatTableData([]);

      expect(data).toEqual([]);
    });

    it("should return an array of data objects if proposals are defined", () => {
      const proposals = [new Proposal()];
      const data = component.formatTableData(proposals);

      expect(data.length).toEqual(1);
    });
  });

  describe("#onClear()", () => {
    it("should dispatch a clearFacetsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onClear();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(clearFacetsAction());
    });
  });

  describe("#onTextSearchChange()", () => {
    it("should dispatch a setTextFilterAction and a fetchProposalsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const query = "test";
      component.onTextSearchChange(query);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ text: query })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(fetchProposalsAction());
    });
  });

  describe("#onDateChange()", () => {
    it("should dispatch a fetchProposalAction if event does not have a value", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = {} as MatDatepickerInputEvent<DateTime>;
      component.onDateChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledOnceWith(fetchProposalsAction());
    });

    it("should set dateRange.begin if event has value and event.targetElement name is begin, and dispatch a fetchProposalsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const beginDate = DateTime.fromJSDate(new Date("2021-01-01"));
      const event = {
        targetElement: {
          getAttribute: (name: string) => "begin",
        },
        value: beginDate,
      } as MatDatepickerInputEvent<DateTime>;

      component.onDateChange(event);

      const expected = beginDate.toUTC().toISO();
      expect(component.dateRange.begin).toEqual(expected);
      expect(dispatchSpy).toHaveBeenCalledOnceWith(fetchProposalsAction());
    });

    it("should set dateRange.end if event has value and event.targetElement name is end, and dispatch a fetchProposalsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const endDate = DateTime.fromJSDate(new Date("2021-07-08"));
      const event = {
        targetElement: {
          getAttribute: (name: string) => "end",
        },
        value: endDate,
      } as MatDatepickerInputEvent<DateTime>;

      component.onDateChange(event);

      const expected = endDate.toUTC().plus({ days: 1 }).toISO();
      expect(component.dateRange.end).toEqual(expected);
      expect(dispatchSpy).toHaveBeenCalledOnceWith(fetchProposalsAction());
    });

    it("should dispatch a setDateRangeFilterAction if dateRange.begin and dateRange.end have values, and dispatch a fetchProposalsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const beginDate = DateTime.fromJSDate(new Date("2021-01-01"));
      const endDate = DateTime.fromJSDate(new Date("2021-07-08"));
      component.dateRange.begin = beginDate.toUTC().toISO();
      const event = {
        targetElement: {
          getAttribute: (name: string) => "end",
        },
        value: endDate,
      } as MatDatepickerInputEvent<DateTime>;

      component.onDateChange(event);

      const expected = {
        begin: beginDate.toUTC().toISO(),
        end: endDate.toUTC().plus({ days: 1 }).toISO(),
      };
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setDateRangeFilterAction(expected)
      );
      expect(dispatchSpy).toHaveBeenCalledWith(fetchProposalsAction());
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 100,
      };

      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a sortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc",
      };

      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column: event.active, direction: event.direction })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a proposal", () => {
      const proposal = new Proposal();
      component.onRowClick(proposal);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/proposals/" + encodeURIComponent(proposal.proposalId)
      );
    });
  });
});
