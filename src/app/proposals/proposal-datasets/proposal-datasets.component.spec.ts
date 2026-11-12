import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  MockStore,
  createMock,
  mockDataset,
  MockDatasetsListService,
} from "shared/MockStubs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { StoreModule, Store } from "@ngrx/store";
import { BehaviorSubject, EMPTY, Subject } from "rxjs";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { fetchProposalDatasetsAction } from "state-management/actions/proposals.actions";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";
import { OutputDatasetDto } from "@scicatproject/scicat-sdk-ts-angular";
import { ProposalDatasetsComponent } from "./proposal-datasets.component";
import {
  RowEventType,
  TableEventType,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { DatasetsListService } from "shared/services/datasets-list.service";
import { EventsService } from "shared/events.service";

const getConfig = () => ({
  logbookEnabled: true,
});

describe("ViewProposalPageComponent", () => {
  let component: ProposalDatasetsComponent;
  let fixture: ComponentFixture<ProposalDatasetsComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    navigate: jasmine.createSpy("navigate"),
  };
  let store: MockStore;
  let dispatchSpy;
  let queryParams$: BehaviorSubject<Params>;
  let message$: Subject<Record<string, unknown>>;
  let eventsService: {
    message$: Subject<Record<string, unknown>>;
    latestUpdatedId$: typeof EMPTY;
    connect: jasmine.Spy;
    disconnect: jasmine.Spy;
  };

  beforeEach(waitForAsync(() => {
    router.navigate.calls.reset();
    queryParams$ = new BehaviorSubject<Params>({});
    message$ = new Subject<Record<string, unknown>>();
    eventsService = {
      message$,
      latestUpdatedId$: EMPTY,
      connect: jasmine.createSpy("connect"),
      disconnect: jasmine.createSpy("disconnect"),
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalDatasetsComponent],
      imports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatTabsModule,
        StoreModule.forRoot({}),
      ],
      providers: [DatePipe, FileSizePipe, SlicePipe],
    });
    TestBed.overrideComponent(ProposalDatasetsComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { queryParams: {} },
              queryParams: queryParams$,
            },
          },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: DatasetsListService, useClass: MockDatasetsListService },
          { provide: EventsService, useValue: eventsService },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDatasetsComponent);
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
    it("should return empty array if there are no datasets", () => {
      const data = component.formatTableData(null);

      expect(data).toEqual([]);
    });

    it("should return an array of data objects if there are datasets", () => {
      const datasets = [mockDataset];
      const data = component.formatTableData(datasets);

      expect(data.length).toEqual(1);
    });
  });

  describe("#onPaginationChange()", () => {
    it("should only change the url, the fetch follows the url", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onPaginationChange({ pageIndex: 2, pageSize: 25, length: 100 });

      expect(router.navigate).toHaveBeenCalledOnceWith([], {
        queryParams: { pageIndex: 2, pageSize: 25 },
        queryParamsHandling: "merge",
      });
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("#onTableEvent()", () => {
    it("should put the sort in the url and go back to the first page", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onTableEvent({
        event: TableEventType.SortChanged,
        sender: { active: "datasetName", direction: "asc" },
      } as any);

      expect(router.navigate).toHaveBeenCalledOnceWith([], {
        queryParams: {
          pageIndex: 0,
          sortColumn: "datasetName",
          sortDirection: "asc",
        },
        queryParamsHandling: "merge",
      });
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should remove the sort from the url when the sort is cleared", () => {
      component.onTableEvent({
        event: TableEventType.SortChanged,
        sender: { active: "datasetName", direction: "" },
      } as any);

      expect(router.navigate).toHaveBeenCalledOnceWith([], {
        queryParams: {
          pageIndex: 0,
          sortColumn: undefined,
          sortDirection: undefined,
        },
        queryParamsHandling: "merge",
      });
    });
  });

  describe("fetching on the url", () => {
    beforeEach(() => {
      component.proposalId = "testId";
      dispatchSpy = spyOn(store, "dispatch");
    });

    const fetchAction = (
      skip: number,
      limit: number,
      sortColumn: string,
      sortDirection: string,
    ) =>
      fetchProposalDatasetsAction({
        proposalId: "testId",
        skip,
        limit,
        sortColumn,
        sortDirection,
      });

    it("should fetch what the url says", () => {
      queryParams$.next({
        pageIndex: "2",
        pageSize: "25",
        sortColumn: "datasetName",
        sortDirection: "asc",
      });

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        fetchAction(50, 25, "datasetName", "asc"),
      );
      expect(component.tableSort).toEqual({
        sortColumn: "datasetName",
        sortDirection: "asc",
      });
      // the table header shows it
      expect(component.setting.tableSort).toEqual(component.tableSort);
    });

    it("should fall back to the default sort when the url has none", () => {
      queryParams$.next({ pageIndex: "1" });

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        fetchAction(10, 10, "creationTime", "desc"),
      );
      expect(component.tableSort).toEqual({
        sortColumn: "creationTime",
        sortDirection: "desc",
      });
    });

    it("should ignore a sort without a valid direction", () => {
      queryParams$.next({
        pageIndex: "1",
        sortColumn: "pid",
        sortDirection: "sideways",
      });

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        fetchAction(10, 10, "creationTime", "desc"),
      );
    });

    it("should not fetch when the url means the table it already shows", () => {
      queryParams$.next({ pageIndex: "0", unrelated: "a" });

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should not fetch again when only other params change", () => {
      queryParams$.next({ pageIndex: "1", unrelated: "a" });
      queryParams$.next({ pageIndex: "1", unrelated: "b" });

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("live updates", () => {
    const sortedByName = {
      pageIndex: "2",
      pageSize: "25",
      sortColumn: "datasetName",
      sortDirection: "asc",
    };
    const sortedByNameFetch = fetchProposalDatasetsAction({
      proposalId: "testId",
      skip: 50,
      limit: 25,
      sortColumn: "datasetName",
      sortDirection: "asc",
    });

    beforeEach(() => {
      component.proposalId = "testId";
      queryParams$.next(sortedByName);
      dispatchSpy = spyOn(store, "dispatch");
    });

    it("should refetch what the url says when a dataset of the proposal is created", () => {
      message$.next({
        type: "Dataset.created",
        data: { proposalIds: ["testId"] },
      });

      expect(dispatchSpy).toHaveBeenCalledOnceWith(sortedByNameFetch);
    });

    it("should not refetch for a dataset of another proposal", () => {
      message$.next({
        type: "Dataset.created",
        data: { proposalIds: ["another"] },
      });

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should not refetch for other events", () => {
      message$.next({
        type: "Dataset.updated",
        data: { proposalIds: ["testId"] },
      });

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should refetch what the url says when live updates are switched on", () => {
      component.onRealTimeToggle(true);

      expect(eventsService.connect).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledOnceWith(sortedByNameFetch);
    });

    it("should only disconnect when live updates are switched off", () => {
      component.onRealTimeToggle(false);

      expect(eventsService.disconnect).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = createMock<OutputDatasetDto>({});
      const pid = encodeURIComponent(dataset.pid);
      component.onRowClick({
        event: RowEventType.RowClick,
        sender: { row: dataset },
      });

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith("/datasets/" + pid);
    });
  });
});
