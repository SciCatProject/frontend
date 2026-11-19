import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PublisheddataDashboardComponent } from "./publisheddata-dashboard.component";
import { mockPublishedData } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { BehaviorSubject } from "rxjs";
import { RowEventType } from "shared/modules/dynamic-material-table/models/table-row.model";
import { selectPublishedDataDashboardPageViewModel } from "state-management/selectors/published-data.selectors";
import {
  changePageAction,
  setTextFilterAction,
} from "state-management/actions/published-data.actions";

describe("PublisheddataDashboardComponent", () => {
  let component: PublisheddataDashboardComponent;
  let fixture: ComponentFixture<PublisheddataDashboardComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    navigate: jasmine.createSpy("navigate"),
  };
  const queryParams = new BehaviorSubject<Record<string, string>>({});

  const vm = {
    publishedData: [mockPublishedData],
    count: 1,
    currentPage: 0,
    publishedDataPerPage: 5,
    filters: { text: "", sortField: "createdAt:desc", skip: 0, limit: 5 },
    hasFetchedSettings: true,
    isLoading: false,
    tablesSettings: { columns: [] },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PublisheddataDashboardComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { queryParams } },
        provideMockStore({
          selectors: [
            { selector: selectPublishedDataDashboardPageViewModel, value: vm },
          ],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    queryParams.next({});
    router.navigateByUrl.calls.reset();
    router.navigate.calls.reset();
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, "dispatch");
    fixture = TestBed.createComponent(PublisheddataDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#ngOnInit", () => {
    it("should push published data from the store to the table", () => {
      expect(component.dataSource.value).toEqual([mockPublishedData]);
      expect(component.pagination.length).toEqual(1);
    });

    it("should fetch with the default page when no query params are set", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ text: "" }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: 0, limit: 5 }),
      );
    });

    it("should fetch with paging and text search from query params", () => {
      queryParams.next({ pageIndex: "2", pageSize: "10", textSearch: "doi" });

      expect(component.globalTextSearch).toEqual("doi");
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ text: "doi" }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: 2, limit: 10 }),
      );
    });
  });

  describe("#onRowEvent", () => {
    it("should navigate to a Published Dataset", () => {
      const published = mockPublishedData;
      const id = encodeURIComponent(published.doi);

      component.onRowEvent({
        event: RowEventType.RowClick,
        sender: { row: published },
      } as any);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/publishedDatasets/" + id,
      );
    });
  });

  describe("#onGlobalTextSearchAction", () => {
    it("should put the text search in the URL and reset the page", () => {
      component.onGlobalTextSearchChange("doi");
      component.onGlobalTextSearchAction();

      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { textSearch: "doi", pageIndex: 0 },
        queryParamsHandling: "merge",
      });
    });
  });
});
