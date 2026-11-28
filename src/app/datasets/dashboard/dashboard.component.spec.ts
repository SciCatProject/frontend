import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";

import {
  MockActivatedRoute,
  MockStore,
  mockDataset as dataset,
} from "shared/MockStubs";
import { DashboardComponent } from "./dashboard.component";
import { of } from "rxjs";
import {
  changePageAction,
  fetchMetadataKeysAction,
} from "state-management/actions/datasets.actions";
import {
  MockStore as NgrxMockStore,
  provideMockStore,
} from "@ngrx/store/testing";
import { selectSelectedDatasets } from "state-management/selectors/datasets.selectors";
import {
  selectColumns,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { PageChangeEvent } from "shared/modules/table/table.component";

class MockMatDialog {
  open() {
    return {
      afterClosed: () =>
        of({
          datasetName: "Test Name",
          description: "Test description",
          ownerGroup: "test",
          sourceFolder: "/nfs/test",
          usedSoftware: "test software",
        }),
    };
  }
}

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    events: of(new NavigationStart(1, "/datasets")),
  };

  let config: Record<string, unknown>;
  const getConfig = () => config;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    config = { shoppingCartOnHeader: true };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatSidenavModule,
        StoreModule.forRoot({}),
      ],
      declarations: [DashboardComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectSelectedDatasets, value: [] },
            { selector: selectColumns, value: [] },
            { selector: selectIsLoggedIn, value: false },
          ],
        }),
      ],
    });
    TestBed.overrideComponent(DashboardComponent, {
      set: {
        providers: [
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: MatDialog, useClass: MockMatDialog },
          { provide: Router, useValue: router },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("metadata keys of the old condition filter", () => {
    const fetchedOnInit = () => {
      const dispatch = spyOn(TestBed.inject(Store), "dispatch");
      fixture = TestBed.createComponent(DashboardComponent);
      fixture.detectChanges();
      return dispatch.calls
        .allArgs()
        .some(
          ([action]) =>
            (action as { type?: string }).type === fetchMetadataKeysAction.type,
        );
    };

    it("should be fetched for the old condition filter", () => {
      config.advancedSearchEnabled = false;

      expect(fetchedOnInit()).toBeTrue();
    });

    it("should not be fetched for the advanced search, it loads its own", () => {
      expect(fetchedOnInit()).toBeFalse();
    });
  });

  describe("side filter", () => {
    const render = () => {
      fixture = TestBed.createComponent(DashboardComponent);
      fixture.detectChanges();
      return fixture.nativeElement as HTMLElement;
    };

    it("should be shown without the advanced filter", () => {
      config.advancedSearchEnabled = false;

      const page = render();

      expect(page.querySelector("datasets-filter")).not.toBeNull();
      expect(page.querySelectorAll(".action-column").length).toBe(2);
    });

    it("should be gone with its column when the advanced filter is not configured", () => {
      const page = render();

      expect(page.querySelector("datasets-filter")).toBeNull();
      expect(page.querySelector(".action-column")).toBeNull();
      expect(page.querySelector("dataset-table")).not.toBeNull();
    });

    it("should be gone with the advanced filter", () => {
      config.advancedSearchEnabled = true;

      expect(render().querySelector("datasets-filter")).toBeNull();
    });

    it("should leave the column for the create dataset card with the advanced filter", () => {
      config.advancedSearchEnabled = true;
      config.addDatasetEnabled = true;
      (TestBed.inject(Store) as unknown as NgrxMockStore).overrideSelector(
        selectIsLoggedIn,
        true,
      );

      const page = render();

      expect(page.querySelector("datasets-filter")).toBeNull();
      expect(page.querySelector(".add-card")).not.toBeNull();
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/datasets/" + encodeURIComponent(dataset.pid),
      );
    });
  });

  describe("#openDialog()", () => {
    it("should call Ingestor method", () => {
      const mockIngestor = jasmine.createSpyObj("IngestorCreationComponent", [
        "onClickAddIngestion",
      ]);

      component.ingestor = mockIngestor;
      component.openDialog();

      expect(mockIngestor.onClickAddIngestion).toHaveBeenCalledTimes(1);
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25,
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize }),
      );
    });
  });
});
