/* eslint @typescript-eslint/no-empty-function:0 */

import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { DatasetTableActionsComponent } from "./dataset-table-actions.component";
import { MockStore, MockArchivingService, mockDataset } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Store, StoreModule } from "@ngrx/store";
import { ArchViewMode } from "state-management/models";
import {
  setArchiveViewModeAction,
  addToBatchAction,
  clearSelectionAction,
} from "state-management/actions/datasets.actions";
import { ArchivingService } from "datasets/archiving.service";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { of, Subscription } from "rxjs";
import { DatasetJobDialogService } from "datasets/dataset-job-dialog.service";

class MockAppConfigService {
  getConfig = () => ({
    archiveWorkflowEnabled: true,
    markForDeletionCodes: [
      { option: "RETRIEVAL_FAILURE" },
      { option: "ARCHIVING_FAILURE" },
      { option: "MARKED_FOR_DELETION" },
    ],
  });
}

describe("DatasetTableActionsComponent", () => {
  let component: DatasetTableActionsComponent;
  let fixture: ComponentFixture<DatasetTableActionsComponent>;

  let store: MockStore;
  let dispatchSpy;
  const datasetJobDialogServiceSpy = jasmine.createSpyObj(
    "DatasetJobDialogService",
    ["submitWithDialog", "registerSuccessCallback"],
  );

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DatasetTableActionsComponent],
      imports: [
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatIconModule,
        StoreModule.forRoot({}),
      ],
    });
    TestBed.overrideComponent(DatasetTableActionsComponent, {
      set: {
        providers: [
          {
            provide: AppConfigService,
            useClass: MockAppConfigService,
          },
          { provide: ArchivingService, useClass: MockArchivingService },
          {
            provide: DatasetJobDialogService,
            useValue: datasetJobDialogServiceSpy,
          },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    datasetJobDialogServiceSpy.submitWithDialog.calls.reset();
    datasetJobDialogServiceSpy.registerSuccessCallback.calls.reset();
    datasetJobDialogServiceSpy.registerSuccessCallback.and.returnValue(
      undefined,
    );
    datasetJobDialogServiceSpy.submitWithDialog.and.returnValue(
      new Subscription(),
    );

    fixture = TestBed.createComponent(DatasetTableActionsComponent);
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

  it("should contain mode switching buttons", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector(".archivable")).toBeTruthy();
    expect(compiled.querySelector(".archivable").textContent).toContain(
      "Archivable",
    );
    expect(compiled.querySelector(".retrievable")).toBeTruthy();
    expect(compiled.querySelector(".retrievable").textContent).toContain(
      "Retrievable",
    );
    expect(compiled.querySelector(".all")).toBeTruthy();
    expect(compiled.querySelector(".all").textContent).toContain("All");
  });

  describe("#onModeChange()", () => {
    it("should dispatch a SetViewModeAction", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const modeToggle = ArchViewMode.all;

      component.onModeChange(modeToggle);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({ modeToggle }),
      );
    });
  });

  describe("#isEmptySelection()", () => {
    it("should return true if the length of selectedSets equals 0", () => {
      const isEmpty = component.isEmptySelection();

      expect(isEmpty).toEqual(true);
    });

    it("should return false if the length of selectedSets is larger than 0", () => {
      component.selectedSets = [mockDataset];

      const isEmpty = component.isEmptySelection();

      expect(isEmpty).toEqual(false);
    });
  });

  describe("#ngOnInit()", () => {
    it("should register success callbacks for archive, retrieve and markForDeletion", () => {
      // The component is created and detectChanges is called in beforeEach
      // which triggers ngOnInit

      expect(
        datasetJobDialogServiceSpy.registerSuccessCallback,
      ).toHaveBeenCalledWith("archive", jasmine.any(Function));
      expect(
        datasetJobDialogServiceSpy.registerSuccessCallback,
      ).toHaveBeenCalledWith("retrieve", jasmine.any(Function));
      expect(
        datasetJobDialogServiceSpy.registerSuccessCallback,
      ).toHaveBeenCalledWith("markForDeletion", jasmine.any(Function));
    });
  });

  describe("#archiveClickHandle()", () => {
    it("should submit archive through DatasetJobDialogService", () => {
      component.selectedSets = [mockDataset];

      component.archiveClickHandle();

      expect(datasetJobDialogServiceSpy.submitWithDialog).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ width: "auto" }),
        [mockDataset],
        "archive",
        undefined,
      );
    });
  });

  describe("#retrieveClickHandle()", () => {
    it("should submit retrieve through DatasetJobDialogService with new API", () => {
      const archivingService = component["archivingSrv"];
      const dialogOptions = { width: "auto", data: { title: "retrieve" } };
      const retrieveDestinations = [
        { option: "my-option", location: "/archive/base" },
      ];

      component.selectedSets = [mockDataset];
      component.appConfig.retrieveDestinations = retrieveDestinations;
      spyOn(archivingService, "retriveDialogOptions").and.returnValue(
        dialogOptions,
      );
      spyOn(archivingService, "generateOptionLocation").and.returnValue({
        option: "my-option",
        location: "/archive/base/path",
      });

      component.retrieveClickHandle();

      expect(archivingService.retriveDialogOptions).toHaveBeenCalledOnceWith(
        retrieveDestinations,
      );
      expect(datasetJobDialogServiceSpy.submitWithDialog).toHaveBeenCalledTimes(
        1,
      );

      const [
        passedDialogOptions,
        passedDatasets,
        jobType,
        paramsExtractor,
      ] = datasetJobDialogServiceSpy.submitWithDialog.calls.mostRecent().args;

      expect(passedDialogOptions).toEqual(dialogOptions);
      expect(passedDatasets).toEqual([mockDataset]);
      expect(jobType).toEqual("retrieve");
      expect(
        paramsExtractor({ option: "my-option", location: "/path" }),
      ).toEqual({
        destinationPath: "/archive/retrieve",
        option: "my-option",
        location: "/archive/base/path",
      });
    });
  });

  describe("#markForDeletionClickHandle()", () => {
    it("should submit mark-for-deletion through DatasetJobDialogService with new API", () => {
      const archivingService = component["archivingSrv"];
      const dialogOptions = { width: "auto", data: { title: "test" } };

      component.selectedSets = [mockDataset];
      spyOn(archivingService, "markForDeletionDialogOptions").and.returnValue(
        dialogOptions,
      );

      component.markForDeletionClickHandle();

      expect(
        archivingService.markForDeletionDialogOptions,
      ).toHaveBeenCalledOnceWith(component.appConfig.markForDeletionCodes);
      expect(datasetJobDialogServiceSpy.submitWithDialog).toHaveBeenCalledTimes(
        1,
      );

      const [
        passedDialogOptions,
        passedDatasets,
        jobType,
        paramsExtractor,
      ] = datasetJobDialogServiceSpy.submitWithDialog.calls.mostRecent().args;

      expect(passedDialogOptions).toEqual(dialogOptions);
      expect(passedDatasets).toEqual([mockDataset]);
      expect(jobType).toEqual("markForDeletion");
      expect(
        paramsExtractor({
          selectedOption: "ARCHIVING_FAILURE",
          explanation: "Marked from table actions",
        }),
      ).toEqual({
        deletionCode: "ARCHIVING_FAILURE",
        explanation: "Marked from table actions",
      });
    });

    it("should set mark-for-deletion visibility from config", () => {
      expect(component.markForDeletion).toBeTrue();
    });
  });

  describe("#onAddToBatch()", () => {
    it("should dispatch an addToBatchAction and a clearSelectionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onAddToBatch();

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(addToBatchAction());
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectionAction());
    });
  });
});
