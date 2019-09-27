import { APP_CONFIG, AppConfigModule } from "app-config.module";
import { ArchivingService } from "../archiving.service";
import {
  DatasetTableComponent,
  PageChangeEvent,
  SortChangeEvent
} from "./dataset-table.component";
import { HttpClient } from "@angular/common/http";
import {
  MatDialogModule,
  MatTableModule,
  MatCheckboxChange
} from "@angular/material";
import {
  MockHttp,
  MockLoginService,
  MockDatasetApi,
  MockArchivingService,
  MockAttachmentApi,
  MockStore
} from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { combineReducers, StoreModule, Store } from "@ngrx/store";
import { datasetsReducer } from "state-management/reducers/datasets.reducer";
import { jobsReducer } from "state-management/reducers/jobs.reducer";
import { LoginService } from "../../users/login.service";
import { AttachmentApi, DatasetApi, Dataset } from "shared/sdk";
import { SharedCatanieModule } from "shared/shared.module";
import {
  SelectColumnAction,
  DeselectColumnAction
} from "state-management/actions/user.actions";
import { ArchViewMode } from "state-management/models";
import {
  SetViewModeAction,
  SetPublicViewModeAction,
  SelectDatasetAction,
  DeselectDatasetAction,
  SelectAllDatasetsAction,
  ClearSelectionAction,
  ChangePageAction,
  SortByColumnAction,
  AddToBatchAction
} from "state-management/actions/datasets.actions";

describe("DatasetTableComponent", () => {
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        MatDialogModule,
        SharedCatanieModule,
        StoreModule.forRoot({
          datasets: datasetsReducer,
          root: combineReducers({
            jobs: jobsReducer
          })
        }),
        AppConfigModule
      ],
      declarations: [DatasetTableComponent]
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set: {
        providers: [
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useValue: router },
          { provide: AttachmentApi, useClass: MockAttachmentApi },
          { provide: DatasetApi, useClass: MockDatasetApi },
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              archiveWorkflowEnabled: true
            }
          },
          { provide: ArchivingService, useClass: MockArchivingService },
          { provide: LoginService, useClass: MockLoginService }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should contain mode switching buttons", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector(".archivable")).toBeTruthy();
    expect(compiled.querySelector(".archivable").textContent).toContain(
      "Archivable"
    );
    expect(compiled.querySelector(".retrievable")).toBeTruthy();
    expect(compiled.querySelector(".retrievable").textContent).toContain(
      "Retrievable"
    );
    expect(compiled.querySelector(".all")).toBeTruthy();
    expect(compiled.querySelector(".all").textContent).toContain("All");
  });

  describe("#onSelectColumn()", () => {
    it("should do nothing if isUserInput is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = {
        isUserInput: false,
        source: {
          selected: true,
          value: "test"
        }
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch a SelectColumnAction if both isUserInput and selected are true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = {
        isUserInput: true,
        source: {
          selected: true,
          value: "test"
        }
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SelectColumnAction(event.source.value)
      );
    });

    it("should dispatch a DeselectColumnAction if isUserInput is true and selected is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = {
        isUserInput: true,
        source: {
          selected: false,
          value: "test"
        }
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new DeselectColumnAction(event.source.value)
      );
    });
  });

  describe("#onModeChange()", () => {
    it("should dispatch a SetViewModeAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = "test";
      const mode = ArchViewMode.all;

      component.onModeChange(event, mode);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new SetViewModeAction(mode));
    });
  });

  describe("#onViewPublicChange()", () => {
    it("should dispatch a SetPublicViewModeAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const viewPublic = false;
      component.onViewPublicChange(viewPublic);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SetPublicViewModeAction(viewPublic)
      );
    });
  });

  describe("#archiveClickHandle()", () => {
    xit("should...", () => {});
  });

  describe("#retrieveClickHandle()", () => {
    xit("should...", () => {});
  });

  describe("#wipCondition()", () => {
    xit("should...", () => {});
  });

  describe("#systemErrorCondition()", () => {
    xit("should...", () => {});
  });

  describe("#userErrorCondition()", () => {
    it("should return true if dataset has missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archiveStatusMessage: "missingFilesError"
      };

      const userError = component.userErrorCondition(dataset);

      expect(userError).toEqual(true);
    });

    it("should return false if dataset has no missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archiveStatusMessage: ""
      };

      const userError = component.userErrorCondition(dataset);

      expect(userError).toEqual(false);
    });
  });

  describe("#archivableCondition()", () => {
    it("should return false if dataset is not archivable and retrievable and does not have a missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: true,
        archiveStatusMessage: ""
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is not archivable and retrievable and does have a missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: true,
        archiveStatusMessage: "missingFilesError"
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is not archivable and not retrievable and does not have a missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: false,
        archiveStatusMessage: ""
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is not archivable and not retrievable and does have a missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: false,
        archiveStatusMessage: "missingFilesError"
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is not archivable and retrievable and does not have a missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: true,
        archiveStatusMessage: ""
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is archivable and retrievable and does not have a missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: true,
        archiveStatusMessage: ""
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is archivable and retrievable and does have a missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: true,
        archiveStatusMessage: "missingFilesError"
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return true if dataset is archivable and not retrievable and does not have a missingFilesError", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: false,
        archiveStatusMessage: ""
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(true);
    });
  });

  describe("#retrievableCondition()", () => {
    it("should return false if dataset is archivable and not retrievable", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: false
      };

      const retrievable = component.retrievableCondition(dataset);

      expect(retrievable).toEqual(false);
    });

    it("should return false if dataset is not archivable and not retrievable", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: false
      };

      const retrievable = component.retrievableCondition(dataset);

      expect(retrievable).toEqual(false);
    });

    it("should return false if dataset is archivable and retrievable", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: true
      };

      const retrievable = component.retrievableCondition(dataset);

      expect(retrievable).toEqual(false);
    });

    it("should return true if dataset is retrievable and not archivable", () => {
      const dataset = new Dataset();
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: true
      };

      const retrievable = component.retrievableCondition(dataset);

      expect(retrievable).toEqual(true);
    });
  });

  describe("#onClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = new Dataset();
      component.onClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/datasets/" + encodeURIComponent(dataset.pid)
      );
    });
  });

  describe("#isSelected()", () => {
    it("should return false if dataset is not selected", () => {
      const dataset = new Dataset();
      const selected = component.isSelected(dataset);

      expect(selected).toEqual(false);
    });
  });

  describe("#isInBatch()", () => {
    it("should return false if dataset is not in batch", () => {
      const dataset = new Dataset();
      const inBatch = component.isInBatch(dataset);

      expect(inBatch).toEqual(false);
    });
  });

  describe("#onSelect()", () => {
    it("should dispatch a SelectDatasetAction if checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = true;
      const dataset = new Dataset();
      component.onSelect(event, dataset);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SelectDatasetAction(dataset)
      );
    });

    it("should dispatch a DeselectDatasetAction if checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = false;
      const dataset = new Dataset();
      component.onSelect(event, dataset);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new DeselectDatasetAction(dataset)
      );
    });
  });

  describe("#onSelectAll()", () => {
    it("should dispatch a SelectAllDatasetsAction if checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = true;
      component.onSelectAll(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new SelectAllDatasetsAction());
    });

    it("should dispatch a ClearSelectionAction if checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = false;
      component.onSelectAll(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new ClearSelectionAction());
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a ChangePangeAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new ChangePageAction(event.pageIndex, event.pageSize)
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a SortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "datasetName",
        direction: "asc"
      };
      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SortByColumnAction(event.active, event.direction)
      );
    });
  });

  describe("#onAddToBatch()", () => {
    it("should dispatch an AddToBatchAction and a ClearSelectionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onAddToBatch();

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(new AddToBatchAction());
      expect(dispatchSpy).toHaveBeenCalledWith(new ClearSelectionAction());
    });
  });

  describe("#countDerivedDatasets()", () => {
    it("should return the number of derived datasets for a dataset", () => {
      const dataset = new Dataset();
      const numberOfDerivedDataset = component.countDerivedDatasets(dataset);

      expect(numberOfDerivedDataset).toEqual(0);
    });
  });
});
