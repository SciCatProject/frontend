import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { LogbooksDashboardComponent } from "./logbooks-dashboard.component";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore, MockActivatedRoute, createMock } from "shared/MockStubs";
import { ActivatedRoute, Router } from "@angular/router";
import {
  setTextFilterAction,
  fetchDatasetLogbookAction,
  setDisplayFiltersAction,
  changePageAction,
  sortByColumnAction,
} from "state-management/actions/logbooks.actions";
import { LogbookFilters } from "state-management/models";
import { RouterTestingModule } from "@angular/router/testing";

import {
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";

const getConfig = () => ({
  riotBaseUrl: "https://riot.base.com",
});

describe("DashboardComponent", () => {
  let component: LogbooksDashboardComponent;
  let fixture: ComponentFixture<LogbooksDashboardComponent>;

  let router: Router;
  let store: MockStore;
  let dispatchSpy;

  const rawDatasetData = {
    pid: "67ac46e4-5e87-11ed-9634-fba3f42127ef",
    ownerGroup: "testLogbook",
    proposalId: "testLogbook",
    principalInvestigator: "somebody",
    creationLocation: "somewhere",
    owner: "somebody else",
    contactEmail: "somebody@somewhere.here",
    sourceFolder: "some/folders/on/some/server",
    creationTime: undefined,
    type: "raw",
    createdAt: "",
    createdBy: "",
    inputDatasets: [],
    investigator: "",
    numberOfFilesArchived: 0,
    updatedAt: "",
    updatedBy: "",
    usedSoftware: [],
  };
  const dataset = createMock(rawDatasetData);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LogbooksDashboardComponent],
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatExpansionModule,
        MatIconModule,
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot({}),
      ],
    });
    TestBed.overrideComponent(LogbooksDashboardComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: AppConfigService, useValue: { getConfig } },
        ],
      },
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

      const filters: LogbookFilters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25,
      };
      component.applyRouterState(dataset.pid, filters);

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(
        ["/datasets", dataset.pid, "logbook"],
        {
          queryParams: { args: JSON.stringify(filters) },
        },
      );
    });
  });

  describe("#onTextSearchChange()", () => {
    it("should dispatch a setTextFilterAction and a fetchLogbookAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const textSearch = "test";
      component.onTextSearchChange(dataset.pid, textSearch);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ textSearch }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchDatasetLogbookAction({
          pid: dataset.pid,
        }),
      );
    });
  });

  describe("#onFilterSelect()", () => {
    it("should dispatch a setFilterAction and a fetchFilteredEntriesAction, and call #applyRouterState()", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const methodSpy = spyOn(component, "applyRouterState");

      const filters: LogbookFilters = {
        textSearch: "",
        showBotMessages: false,
        showImages: true,
        showUserMessages: true,
        sortField: "timestamp:desc",
        skip: 0,
        limit: 25,
      };
      const { showBotMessages, showImages, showUserMessages } = filters;

      component.onFilterSelect(dataset.pid, filters);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setDisplayFiltersAction({
          showBotMessages,
          showImages,
          showUserMessages,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchDatasetLogbookAction({
          pid: dataset.pid,
        }),
      );
      expect(methodSpy).toHaveBeenCalled();
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction and a fetchLogbookAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 1,
        pageSize: 25,
        length: 100,
      };

      component.onPageChange(dataset.pid, event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchDatasetLogbookAction({ pid: dataset.pid }),
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a sortByColumnAction and a fetchLogbookAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc",
      };

      component.onSortChange(dataset.pid, event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({
          column: event.active,
          direction: event.direction,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchDatasetLogbookAction({ pid: dataset.pid }),
      );
    });
  });
});
