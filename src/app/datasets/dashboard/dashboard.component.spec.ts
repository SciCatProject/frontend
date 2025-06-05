import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
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
    it("should dispatch an addDatasetAction when dialog returns a value", () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 12, 17, 12, 0, 0));

      dispatchSpy = spyOn(store, "dispatch");

      const currentUser = createMock<ReturnedUserDto>({
        id: "testId",
        username: "ldap.Test User",
        email: "test@email.com",
        realm: "test",
        emailVerified: true,
        authStrategy: "local",
      });

      const dataset: DatasetsControllerCreateV3Request = {
        accessGroups: [],
        contactEmail: currentUser.email,
        creationTime: new Date().toISOString(),
        datasetName: "Test Name",
        description: "Test description",
        isPublished: false,
        keywords: [],
        owner: currentUser.username.replace("ldap.", ""),
        ownerEmail: currentUser.email,
        ownerGroup: "test",
        packedSize: 0,
        size: 0,
        sourceFolder: "/nfs/test",
        type: "derived",
        inputDatasets: [],
        investigator: currentUser.email,
        scientificMetadata: {},
        usedSoftware: ["test software"],
        numberOfFilesArchived: 0,
        creationLocation: undefined,
        principalInvestigator: undefined,
      };

      component.currentUser = currentUser;
      component.userGroups = ["test"];

      component.openDialog();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addDatasetAction({
          dataset: dataset,
        }),
      );
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePangeAction", () => {
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
