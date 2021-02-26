import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";

import { LogbooksDashboardComponent } from "./logbooks-dashboard.component";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore, MockActivatedRoute } from "shared/MockStubs";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfigModule } from "app-config.module";
import {
  setTextFilterAction,
  fetchLogbookAction,
  setDisplayFiltersAction,
  changePageAction,
  sortByColumnAction
} from "state-management/actions/logbooks.actions";
import { Logbook, LogbookInterface } from "shared/sdk";
import { LogbookFilters } from "state-management/models";
import { RouterTestingModule } from "@angular/router/testing";
import * as rison from "rison";
import {
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

describe("DashboardComponent", () => {
  let component: LogbooksDashboardComponent;
  let fixture: ComponentFixture<LogbooksDashboardComponent>;

  let router: Router;
  let store: MockStore;
  let dispatchSpy;

  const logbookData: LogbookInterface = {
    name: "tesName",
    roomId: "testId",
    messages: [{ message: "test1" }, { message: "test2" }]
  };
  const logbook = new Logbook(logbookData);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LogbooksDashboardComponent],
      imports: [
        AppConfigModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot({})
      ]
    });
    TestBed.overrideComponent(LogbooksDashboardComponent, {
      set: {
        providers: [{ provide: ActivatedRoute, useClass: MockActivatedRoute }]
      }
    }).compileComponents();

    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksDashboardComponent);
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

  describe("#applyRouterState()", () => {
    it("should call router.navigate if url path contains `logbook`", () => {
      const navigateSpy = spyOn(router, "navigate");

      component.logbook = logbook;
      const filters: LogbookFilters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
      };
      component.applyRouterState(logbook.name, filters);

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(
        ["/logbooks", component.logbook.name],
        {
          queryParams: { args: rison.encode(filters) }
        }
      );
    });
  });

  describe("#onTextSearchChange()", () => {
    it("should dispatch a setTextFilterAction and a fetchLogbookAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;
      const textSearch = "test";
      component.onTextSearchChange(textSearch);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ textSearch })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchLogbookAction({
          name: component.logbook.name
        })
      );
    });
  });

  describe("#onFilterSelect()", () => {
    it("should dispatch a setFilterAction and a fetchFilteredEntriesAction, and call #applyRouterState()", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const methodSpy = spyOn(component, "applyRouterState");

      component.logbook = logbook;
      const filters: LogbookFilters = {
        textSearch: "",
        showBotMessages: false,
        showImages: true,
        showUserMessages: true,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25
      };
      const { showBotMessages, showImages, showUserMessages } = filters;

      component.onFilterSelect(filters);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setDisplayFiltersAction({
          showBotMessages,
          showImages,
          showUserMessages
        })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchLogbookAction({
          name: component.logbook.name
        })
      );
      expect(methodSpy).toHaveBeenCalled();
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction and a fetchLogbookAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;
      const event: PageChangeEvent = {
        pageIndex: 1,
        pageSize: 25,
        length: 100
      };

      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchLogbookAction({ name: logbook.name })
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a sortByColumnAction and a fetchLogbookAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;
      const event: SortChangeEvent = {
        active: "test",
        direction: "asc"
      };

      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column: event.active, direction: event.direction })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchLogbookAction({ name: logbook.name })
      );
    });
  });

  describe("#reverseTimeline()", () => {
    it("should reverse the logbook messages array", () => {
      component.logbook = logbook;
      component.logbook.messages = [{ message: "test1" }, { message: "test2" }];

      component.reverseTimeline();

      expect(component.logbook.messages[0].message).toEqual("test2");
    });
  });
});
