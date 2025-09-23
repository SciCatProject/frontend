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
  createMock,
  mockDataset as dataset,
} from "shared/MockStubs";
import { DashboardComponent } from "./dashboard.component";
import { of } from "rxjs";
import {
  addDatasetAction,
  changePageAction,
} from "state-management/actions/datasets.actions";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";
import {resetIngestionObject} from "state-management/actions/ingestor.actions";
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
import { IngestionRequestInformation } from "ingestor/ingestor-page/helper/ingestor.component-helper";
import {
  DatasetsControllerCreateV3Request,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";

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

  const getConfig = () => ({
    shoppingCartOnHeader: true,
  });

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
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
      const mockIngestor = jasmine.createSpyObj('IngestorCreationComponent', ['onClickAddIngestion']);

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
