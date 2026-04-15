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
import { of, Subscription, throwError } from "rxjs";
import { showMessageAction } from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";
import { DatasetJobDialogService } from "../dataset-job-dialog.service";

describe("BatchViewComponent", () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;

  let dispatchSpy;
  let store: MockStore<DatasetState>;
  const datasetJobDialogServiceSpy = jasmine.createSpyObj(
    "DatasetJobDialogService",
    ["submitWithDialog", "registerSuccessCallback"],
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
    datasetJobDialogServiceSpy.submitWithDialog.calls.reset();
    datasetJobDialogServiceSpy.registerSuccessCallback.calls.reset();
    datasetJobDialogServiceSpy.registerSuccessCallback.and.returnValue(
      undefined,
    );
    datasetJobDialogServiceSpy.submitWithDialog.and.returnValue(
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
    xit("should ...", () => { });
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
    xit("should ...", () => { });
  });

  describe("#onArchive()", () => {
    it("should archive datasets and clear the batch", () => {
      const archivingService = component["archivingSrv"];
      const clearBatchSpy = spyOn(
        component as unknown as { clearBatch: () => void },
        "clearBatch",
      );
      component.batch$ = of([dataset]);
      spyOn(archivingService, "archive").and.returnValue(of(void 0));

      component.onArchive();

      expect(archivingService.archive).toHaveBeenCalledOnceWith([dataset]);
      expect(clearBatchSpy).toHaveBeenCalledTimes(1);
    });

    it("should dispatch an error message when archive fails", () => {
      const archivingService = component["archivingSrv"];
      dispatchSpy = spyOn(store, "dispatch");
      component.batch$ = of([dataset]);
      spyOn(archivingService, "archive").and.returnValue(
        throwError(() => new Error("archive failed")),
      );

      component.onArchive();

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        showMessageAction({
          message: {
            type: MessageType.Error,
            content: "archive failed",
            duration: 5000,
          },
        }),
      );
    });
  });

  describe("#ngOnInit()", () => {
    it("should register success callbacks for retrieve and markForDeletion", () => {
      // The component is created and detectChanges is called in beforeEach
      // which triggers ngOnInit

      expect(
        datasetJobDialogServiceSpy.registerSuccessCallback,
      ).toHaveBeenCalledWith("retrieve", jasmine.any(Function));
      expect(
        datasetJobDialogServiceSpy.registerSuccessCallback,
      ).toHaveBeenCalledWith("markForDeletion", jasmine.any(Function));
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
