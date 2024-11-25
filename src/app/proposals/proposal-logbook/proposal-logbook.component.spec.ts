import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { ProposalLogbookComponent } from "./proposal-logbook.component";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore, MockActivatedRoute, createMock } from "shared/MockStubs";
import { ActivatedRoute } from "@angular/router";
import {
  setTextFilterAction,
  setDisplayFiltersAction,
  changePageAction,
  sortByColumnAction,
  fetchLogbookAction,
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
import { Logbook } from "@scicatproject/scicat-sdk-ts";

const getConfig = () => ({
  riotBaseUrl: "https://riot.base.com",
});

describe("DashboardComponent", () => {
  let component: ProposalLogbookComponent;
  let fixture: ComponentFixture<ProposalLogbookComponent>;

  let store: MockStore;
  let dispatchSpy;

  const logbook = createMock<Logbook>({
    name: "testLogbook",
    roomId: "testId",
    messages: [{ message: "test1" }, { message: "test2" }],
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalLogbookComponent],
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatExpansionModule,
        MatIconModule,
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot({}),
      ],
    });
    TestBed.overrideComponent(ProposalLogbookComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: AppConfigService, useValue: { getConfig } },
        ],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalLogbookComponent);
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
    it("should dispatch a setTextFilterAction and a fetchLogbookAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const textSearch = "test";
      component.onTextSearchChange(logbook.name, textSearch);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ textSearch }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchLogbookAction({
          name: logbook.name,
        }),
      );
    });
  });

  describe("#onFilterSelect()", () => {
    it("should dispatch a setFilterAction and a fetchFilteredEntriesAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

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

      component.onFilterSelect(logbook.name, filters);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setDisplayFiltersAction({
          showBotMessages,
          showImages,
          showUserMessages,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchLogbookAction({
          name: logbook.name,
        }),
      );
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

      component.onPageChange(logbook.name, event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchLogbookAction({ name: logbook.name }),
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

      component.onSortChange(logbook.name, event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({
          column: event.active,
          direction: event.direction,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchLogbookAction({ name: logbook.name }),
      );
    });
  });
});
