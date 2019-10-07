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
  updateFilterAction,
  fetchFilteredEntriesAction
} from "state-management/actions/logbooks.actions";
import { Logbook } from "shared/sdk";

const logbook = new Logbook();

describe("DashboardComponent", () => {
  let component: LogbooksDashboardComponent;
  let fixture: ComponentFixture<LogbooksDashboardComponent>;

  let store: MockStore;
  let dispatchSpy;

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
    it("should dispatch an updateFilterAction and a fetchFilterEntriesAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logbook = logbook;
      component.logbook.name = "testName";
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
        updateFilterAction({ filters: component.filters })
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
