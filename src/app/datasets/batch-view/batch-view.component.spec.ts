/* eslint @typescript-eslint/no-empty-function:0 */

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BatchViewComponent } from "./batch-view.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MockActivatedRoute,
  MockArchivingService,
  MockDatasetApi,
  mockDataset as dataset,
} from "shared/MockStubs";
import { ArchivingService } from "../archiving.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { MatDialogModule } from "@angular/material/dialog";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { DatasetState } from "state-management/state/datasets.store";
import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { removeFromBatchAction } from "state-management/actions/datasets.actions";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { AppConfigService } from "app-config.service";
import { DatasetsService } from "@scicatproject/scicat-sdk-ts-angular";
import { Subscription } from "rxjs";
import { DatasetJobDialogService } from "../dataset-job-dialog.service";

describe("BatchViewComponent", () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;

  let dispatchSpy;
  let store: MockStore<DatasetState>;
  const datasetJobDialogServiceSpy = jasmine.createSpyObj(
    "DatasetJobDialogService",
    ["submitJobWithDialog", "registerSuccessCallback"],
  );

  const router = {
    navigate: jasmine.createSpy("navigate"),
  };

  const markForDeletionCodes = [
    { option: "RETRIEVAL_FAILURE" },
    { option: "ARCHIVING_FAILURE" },
    { option: "MARKED_FOR_DELETION" },
  ];

  const getConfig = () => ({
    archiveWorkflowEnabled: true,
    markForDeletionCodes,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BatchViewComponent],
      imports: [
        MatButtonModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        SharedScicatFrontendModule,
      ],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectDatasetsInBatch, value: [] }],
        }),
      ],
    });

    TestBed.overrideComponent(BatchViewComponent, {
      set: {
        providers: [
          { provide: ArchivingService, useClass: MockArchivingService },
          { provide: Router, useValue: router },
          { provide: DatasetsService, useClass: MockDatasetApi },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          {
            provide: DatasetJobDialogService,
            useValue: datasetJobDialogServiceSpy,
          },
        ],
      },
    });
    TestBed.compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    datasetJobDialogServiceSpy.submitJobWithDialog.calls.reset();
    datasetJobDialogServiceSpy.registerSuccessCallback.calls.reset();
    datasetJobDialogServiceSpy.registerSuccessCallback.and.returnValue(
      undefined,
    );
    datasetJobDialogServiceSpy.submitJobWithDialog.and.returnValue(
      new Subscription(),
    );

    fixture = TestBed.createComponent(BatchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#clearBatch()", () => {
    it("should dispatch a clearBatchAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component["clearBatch"]();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("#onEmpty()", () => {
    xit("should ...", () => {});
  });

  describe("#onRemove()", () => {
    it("should dispatch a removeFromBatchAction", () => {
      dispatchSpy = spyOn(store, "dispatch");
      component.onRemove(dataset);

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        removeFromBatchAction({ dataset }),
      );
    });
  });

  describe("#onPublish()", () => {
    it("should navigate to datasets/selection/publish", () => {
      component.onPublish();

      expect(component["router"].navigate).toHaveBeenCalledOnceWith([
        "datasets",
        "selection",
        "publish",
      ]);
    });
  });

  describe("#onShare()", () => {
    xit("should ...", () => {});
  });

  describe("#onArchive()", () => {
    it("should submit archive through DatasetJobDialogService with dialog", () => {
      component.datasetList = [dataset];

      component.onArchive();

      expect(
        datasetJobDialogServiceSpy.submitJobWithDialog,
      ).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ width: "auto" }),
        [dataset],
        "archive",
        undefined,
      );
    });
  });

  describe("#ngOnInit()", () => {
    it("should register success callback", () => {
      // The component is created and detectChanges is called in beforeEach
      // which triggers ngOnInit

      expect(
        datasetJobDialogServiceSpy.registerSuccessCallback,
      ).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });

  describe("#onRetrieve()", () => {
    it("should submit retrieve through DatasetJobDialogService with dialog", () => {
      const archivingService = component["archivingSrv"];
      const dialogOptions = { width: "auto", data: { title: "retrieve" } };
      const retrieveDestinations = [{ option: "my-option", location: "/base" }];

      component.datasetList = [dataset];
      component.appConfig.retrieveDestinations = retrieveDestinations;
      spyOn(archivingService, "retriveDialogOptions").and.returnValue(
        dialogOptions,
      );
      spyOn(archivingService, "generateOptionLocation").and.returnValue({
        option: "my-option",
        location: "/base/path",
      });

      component.onRetrieve();

      expect(archivingService.retriveDialogOptions).toHaveBeenCalledOnceWith(
        retrieveDestinations,
      );
      expect(
        datasetJobDialogServiceSpy.submitJobWithDialog,
      ).toHaveBeenCalledTimes(1);

      const [passedDialogOptions, passedDatasets, jobType, paramsExtractor] =
        datasetJobDialogServiceSpy.submitJobWithDialog.calls.mostRecent().args;

      expect(passedDialogOptions).toEqual(dialogOptions);
      expect(passedDatasets).toEqual([dataset]);
      expect(jobType).toEqual("retrieve");
      expect(
        paramsExtractor({ option: "my-option", location: "/path" }),
      ).toEqual({
        destinationPath: "/archive/retrieve",
        option: "my-option",
        location: "/base/path",
      });
    });
  });

  describe("#onMarkForDeletion()", () => {
    it("should submit mark-for-deletion through DatasetJobDialogService with dialog", () => {
      const archivingService = component["archivingSrv"];
      const dialogOptions = { width: "auto", data: { title: "test" } };

      component.datasetList = [dataset];
      spyOn(archivingService, "markForDeletionDialogOptions").and.returnValue(
        dialogOptions,
      );

      component.onMarkForDeletion();

      expect(
        archivingService.markForDeletionDialogOptions,
      ).toHaveBeenCalledOnceWith(markForDeletionCodes);
      expect(
        datasetJobDialogServiceSpy.submitJobWithDialog,
      ).toHaveBeenCalledTimes(1);

      const [passedDialogOptions, passedDatasets, jobType, paramsExtractor] =
        datasetJobDialogServiceSpy.submitJobWithDialog.calls.mostRecent().args;

      expect(passedDialogOptions).toEqual(dialogOptions);
      expect(passedDatasets).toEqual([dataset]);
      expect(jobType).toEqual("markForDeletion");
      expect(
        paramsExtractor({
          selectedOption: "MARKED_FOR_DELETION",
          explanation: "Reason provided",
        }),
      ).toEqual({
        deletionCode: "MARKED_FOR_DELETION",
        explanation: "Reason provided",
      });
    });

    it("should set mark-for-deletion visibility from config", () => {
      expect(component.markForDeletion).toBeTrue();
    });
  });
});
