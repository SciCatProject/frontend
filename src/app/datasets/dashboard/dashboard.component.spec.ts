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
import {
  selectColumnAction,
  deselectColumnAction,
} from "state-management/actions/user.actions";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SelectColumnEvent } from "datasets/dataset-table-settings/dataset-table-settings.component";
import { provideMockStore } from "@ngrx/store/testing";
import { selectSelectedDatasets } from "state-management/selectors/datasets.selectors";
import { TableColumn } from "state-management/models";
import {
  selectColumns,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { PageChangeEvent } from "shared/modules/table/table.component";
import {
  DatasetsControllerCreateRequest,
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
      declarations: [DashboardComponent, MatSidenav],
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

  describe("#onSettingsClick()", () => {
    it("should toggle the sideNav", () => {
      const toggleSpy = spyOn(component.sideNav, "toggle");

      component.onSettingsClick();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it("should not clear the search column if sidenav is open", () => {
      component.sideNav.opened = false;
      // The opened status is toggled when onSettingsClick is called
      component.onSettingsClick();

      expect(component.clearColumnSearch).toEqual(false);
    });

    it("should clear the search column if sidenav is closed", () => {
      component.sideNav.opened = true;
      // The opened status is toggled when onSettingsClick is called
      component.onSettingsClick();

      expect(component.clearColumnSearch).toEqual(true);
    });
  });

  describe("#onCloseClick()", () => {
    it("should close the sideNav", () => {
      const closeSpy = spyOn(component.sideNav, "close");

      component.onCloseClick();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("#onSelectColumn()", () => {
    const column: TableColumn = {
      name: "test",
      order: 0,
      type: "standard",
      enabled: false,
    };

    it("should dispatch a selectColumnAction if checkBoxChange.checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkBoxChange = {
        checked: true,
      } as MatCheckboxChange;

      const event: SelectColumnEvent = {
        checkBoxChange,
        column,
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        selectColumnAction({ name: column.name, columnType: column.type }),
      );
    });

    it("should dispatch a deselectColumnAction if checkBoxChange.checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkBoxChange = {
        checked: false,
      } as MatCheckboxChange;

      const event: SelectColumnEvent = {
        checkBoxChange,
        column,
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectColumnAction({ name: column.name, columnType: column.type }),
      );
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

      const dataset: DatasetsControllerCreateRequest = {
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

  describe("#tableColumn$ observable", () => {
    it("should show 'select' column when user is logged in", () => {
      const testColumn: TableColumn = {
        name: "test",
        order: 0,
        type: "standard",
        enabled: false,
      };
      const selectColumn: TableColumn = {
        name: "select",
        order: 1,
        type: "standard",
        enabled: true,
      };
      selectColumns.setResult([testColumn, selectColumn]);
      selectIsLoggedIn.setResult(true);

      component.tableColumns$.subscribe((result) => {
        expect(result.length).toEqual(2);
      });

      selectIsLoggedIn.setResult(false);
      component.tableColumns$.subscribe((result) =>
        expect(result).toEqual([testColumn]),
      );
    });
  });
});
