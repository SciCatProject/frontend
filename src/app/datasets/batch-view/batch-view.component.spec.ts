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

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
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
import { of, throwError } from "rxjs";
import { showMessageAction } from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";
import { DialogComponent } from "shared/modules/dialog/dialog.component";

describe("BatchViewComponent", () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;

  let dispatchSpy;
  let store: MockStore<DatasetState>;

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
        ],
      },
    });
    TestBed.compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
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
    xit("should ...", () => {});
  });

  describe("#onRetrieve()", () => {
    xit("should ...", () => {});
  });

  describe("#onMarkForDeletion()", () => {
    it("should submit a mark-for-deletion job and clear the batch", () => {
      const archivingService = component["archivingSrv"];
      const dialog = component["dialog"];
      const dialogOptions = { width: "auto", data: { title: "test" } };
      const dialogResult = {
        selectedOption: "MARKED_FOR_DELETION",
        explanation: "Reason provided",
      };
      const dialogRefStub = {
        afterClosed: () => of(dialogResult),
      } as unknown as MatDialogRef<DialogComponent, typeof dialogResult>;
      const clearBatchSpy = spyOn(
        component as unknown as { clearBatch: () => void },
        "clearBatch",
      );
      const openSpy = spyOn(dialog, "open").and.returnValue(dialogRefStub);

      component.datasetList = [dataset];
      spyOn(archivingService, "markForDeletionDialogOptions").and.returnValue(
        dialogOptions,
      );
      spyOn(archivingService, "markForDeletion").and.returnValue(of(void 0));

      component.onMarkForDeletion();

      expect(
        archivingService.markForDeletionDialogOptions,
      ).toHaveBeenCalledOnceWith(markForDeletionCodes);
      expect(openSpy).toHaveBeenCalledOnceWith(DialogComponent, dialogOptions);
      expect(archivingService.markForDeletion).toHaveBeenCalledOnceWith(
        [dataset],
        {
          deletionCode: "MARKED_FOR_DELETION",
          explanation: "Reason provided",
        },
      );
      expect(clearBatchSpy).toHaveBeenCalledTimes(1);
    });

    it("should dispatch an error message if mark-for-deletion fails", () => {
      const archivingService = component["archivingSrv"];
      const dialog = component["dialog"];
      const dialogResult = {
        selectedOption: "MARKED_FOR_DELETION",
        explanation: "Reason provided",
      };
      const dialogRefStub = {
        afterClosed: () => of(dialogResult),
      } as unknown as MatDialogRef<DialogComponent, typeof dialogResult>;

      dispatchSpy = spyOn(store, "dispatch");
      component.datasetList = [dataset];
      spyOn(dialog, "open").and.returnValue(dialogRefStub);
      spyOn(archivingService, "markForDeletionDialogOptions").and.returnValue({
        width: "auto",
        data: { title: "test" },
      });
      spyOn(archivingService, "markForDeletion").and.returnValue(
        throwError(() => new Error("mark failed")),
      );

      component.onMarkForDeletion();

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        showMessageAction({
          message: {
            type: MessageType.Error,
            content: "mark failed",
            duration: 5000,
          },
        }),
      );
    });

    it("should set mark-for-deletion visibility from config", () => {
      expect(component.markForDeletion).toBeTrue();
    });
  });
});
