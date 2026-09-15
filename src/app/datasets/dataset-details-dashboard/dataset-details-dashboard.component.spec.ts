import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";

import { DatasetDetailsDashboardComponent } from "./dataset-details-dashboard.component";
import { MockActivatedRoute, MockUserApi } from "shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MockStore } from "@ngrx/store/testing";
import {
  AppConfigService,
  DATASET_INCLUDE_FIELDS,
  DatasetDetailsTabsInclude,
} from "app-config.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { of } from "rxjs";
import { fetchDatasetAction } from "state-management/actions/datasets.actions";

describe("DetailsDashboardComponent", () => {
  let component: DatasetDetailsDashboardComponent;
  let fixture: ComponentFixture<DatasetDetailsDashboardComponent>;
  let store: MockStore;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    events: of(),
  };

  const getConfig = () => ({
    editMetadataEnabled: true,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DatasetDetailsDashboardComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTabsModule,
        BrowserAnimationsModule,
        SharedScicatFrontendModule,
        StoreModule.forRoot({}),
      ],
      providers: [],
    });
    TestBed.overrideComponent(DatasetDetailsDashboardComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: UsersService, useClass: MockUserApi },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetDetailsDashboardComponent);
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

  it("should request no related documents for Details by default", () => {
    const dispatch = spyOn(store, "dispatch");
    component.fetchDataForTab("dataset-id", "details");
    expect(dispatch).toHaveBeenCalledWith(
      fetchDatasetAction({ pid: "dataset-id", filters: [] }),
    );
  });

  it("should include documents configured for Details label lookups", () => {
    component.appConfig.datasetDetailsTabsInclude = {
      details: ["proposals", "samples", "instruments"],
    };
    const dispatch = spyOn(store, "dispatch");
    component.fetchDataForTab("dataset-id", "details");
    expect(dispatch).toHaveBeenCalledWith(
      fetchDatasetAction({
        pid: "dataset-id",
        filters: ["proposals", "samples", "instruments"],
      }),
    );
  });

  it("should preserve every supported include", () => {
    component.appConfig.datasetDetailsTabsInclude = {
      details: [...DATASET_INCLUDE_FIELDS],
    };
    const dispatch = spyOn(store, "dispatch");
    const warn = spyOn(console, "warn");
    component.fetchDataForTab("dataset-id", "details");
    expect(dispatch).toHaveBeenCalledWith(
      fetchDatasetAction({
        pid: "dataset-id",
        filters: [...DATASET_INCLUDE_FIELDS],
      }),
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it("should ignore unsupported includes while retaining valid ones across tabs", () => {
    component.appConfig.datasetDetailsTabsInclude = {
      details: ["proposals", "proposallls", null, 42, {}, "instruments"],
      datafiles: ["origdatablocks"],
    } as unknown as DatasetDetailsTabsInclude;
    const dispatch = spyOn(store, "dispatch");
    const warn = spyOn(console, "warn");

    component.fetchDataForTab("dataset-id", "details");
    expect(dispatch).toHaveBeenCalledWith(
      fetchDatasetAction({
        pid: "dataset-id",
        filters: ["proposals", "instruments"],
      }),
    );
    expect(warn).toHaveBeenCalledWith(
      'Ignoring unsupported dataset include for tab "details":',
      "proposallls",
    );

    component.fetchDataForTab("dataset-id", "datafiles");
    expect(dispatch).toHaveBeenCalledWith(
      fetchDatasetAction({
        pid: "dataset-id",
        filters: ["proposals", "instruments", "origdatablocks"],
      }),
    );
  });

  [["proposallls", "unknown"], "proposals", { proposals: true }, 42].forEach(
    (includes) => {
      it(`should fetch the base dataset for invalid includes ${JSON.stringify(includes)}`, () => {
        component.appConfig.datasetDetailsTabsInclude = {
          details: includes,
        } as unknown as DatasetDetailsTabsInclude;
        const dispatch = spyOn(store, "dispatch");
        const warn = spyOn(console, "warn");

        component.fetchDataForTab("dataset-id", "details");

        expect(dispatch).toHaveBeenCalledWith(
          fetchDatasetAction({ pid: "dataset-id", filters: [] }),
        );
        expect(warn).toHaveBeenCalled();
      });
    },
  );
});
