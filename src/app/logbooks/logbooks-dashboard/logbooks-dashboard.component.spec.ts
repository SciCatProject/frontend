import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { MatCardModule, MatIconModule } from "@angular/material";

import { LogbooksDashboardComponent } from "./logbooks-dashboard.component";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore, MockActivatedRoute } from "shared/MockStubs";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfigModule } from "app-config.module";
import {
  setFilterAction,
  fetchFilteredEntriesAction
} from "state-management/actions/logbooks.actions";
import { Logbook, LogbookInterface } from "shared/sdk";
import { LogbookFilters } from "state-management/models";
import { RouterTestingModule } from "@angular/router/testing";
import * as rison from "rison";

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

  beforeEach(async(() => {
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

    router = TestBed.get(Router);
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
    it("should do nothing if properties logbook and filters are undefined and url path does not contain `logbook`", () => {
      const navigateSpy = spyOn(router, "navigate");

      component.applyRouterState();

      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });

    it("should call router.navigate if properties logbook and filters are defined  and url path contains `logbook`", () => {
      const navigateSpy = spyOn(router, "navigate");

      component.logbook = logbook;
      component.filters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };
      component.applyRouterState();

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(
        ["/logbooks", component.logbook.name],
        {
          queryParams: { args: rison.encode(component.filters) }
        }
      );
    });
  });

  describe("#onTextSearchChange()", () => {
    it("should dispatch a setFilterAction and a fetchFilterEntriesAction, and call #applyRouterState()", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const methodSpy = spyOn(component, "applyRouterState");

      component.logbook = logbook;
      component.filters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };
      const query = "test";
      component.filters.textSearch = query;
      component.onTextSearchChange(query);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({
          name: component.logbook.name,
          filters: component.filters
        })
      );
      expect(methodSpy).toHaveBeenCalled();
    });
  });

  describe("onFilterSelect()", () => {
    it("should dispatch a setFilterAction and a fetchFilteredEntriesAction, and call #applyRouterState()", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const methodSpy = spyOn(component, "applyRouterState");

      component.logbook = logbook;
      component.filters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };
      const updatedFilters: LogbookFilters = {
        textSearch: "",
        showBotMessages: false,
        showImages: true,
        showUserMessages: true
      };

      component.onFilterSelect(updatedFilters);

      component.filters = updatedFilters;

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setFilterAction({ filters: component.filters })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchFilteredEntriesAction({
          name: component.logbook.name,
          filters: component.filters
        })
      );
      expect(methodSpy).toHaveBeenCalled();
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
