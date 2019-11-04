import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { rootReducer } from "state-management/reducers/root.reducer";
import { MatCardModule, MatIconModule } from "@angular/material";

import { LogbooksDashboardComponent } from "./logbooks-dashboard.component";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore, MockActivatedRoute } from "shared/MockStubs";
import { ActivatedRoute } from "@angular/router";
import { AppConfigModule } from "app-config.module";
import {
  setFilterAction,
  fetchFilteredEntriesAction
} from "state-management/actions/logbooks.actions";
import { Logbook, LogbookInterface } from "shared/sdk";
import { LogbookFilters } from "state-management/models";

describe("DashboardComponent", () => {
  let component: LogbooksDashboardComponent;
  let fixture: ComponentFixture<LogbooksDashboardComponent>;

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
        StoreModule.forRoot({ rootReducer })
      ]
    });
    TestBed.overrideComponent(LogbooksDashboardComponent, {
      set: {
        providers: [{ provide: ActivatedRoute, useClass: MockActivatedRoute }]
      }
    }).compileComponents();
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

  describe("#onTextSearchChange()", () => {
    it("should dispatch an setFilterAction and a fetchFilterEntriesAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

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
    });
  });

  describe("onFilterSelect()", () => {
    it("should dispatch an setFilterAction and a fetchFilteredEntriesAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

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
