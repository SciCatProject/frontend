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
import { ArchivingService } from "datasets/archiving.service";
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
import { ActionConfig } from "shared/modules/configurable-actions/configurable-action.interfaces";

describe("BatchViewComponent", () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;

  let dispatchSpy;
  let store: MockStore<DatasetState>;

  const router = {
    navigate: jasmine.createSpy("navigate"),
  };

  const markForDeletionCodes = [
    "RETRIEVAL_FAILURE",
    "ARCHIVING_FAILURE",
    "MARKED_FOR_DELETION",
  ];

  const batchActions: ActionConfig[] = [
    {
      id: "batch-archive",
      order: 1,
      label: "Archive",
      mat_icon: "archive",
      type: "form",
      url: "/api/v3/jobs",
    },
    {
      id: "batch-retrieve",
      order: 2,
      label: "Retrieve",
      mat_icon: "cloud_download",
      type: "workflow",
      actions: [
        {
          id: "batch-retrieve-open-form",
          order: 1,
          label: "Retrieve Form",
          type: "local",
          handler: "openRetrieveForm",
        },
      ],
    },
    {
      id: "batch-mark-for-deletion",
      order: 3,
      label: "Mark for Deletion",
      mat_icon: "delete",
      type: "form",
      url: "/api/v3/jobs",
      requiresMarkForDeletionCodes: true,
    },
  ];

  const getConfig = () => ({
    archiveWorkflowEnabled: true,
    batchActionsEnabled: true,
    batchActions,
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

  describe("#filteredBatchActions", () => {
    it("should include all actions when markForDeletion codes are configured", () => {
      expect(component.filteredBatchActions.map((a) => a.id)).toEqual([
        "batch-archive",
        "batch-retrieve",
        "batch-mark-for-deletion",
      ]);
    });

    it("should exclude requiresMarkForDeletionCodes actions when no deletion codes are configured", () => {
      component.markForDeletion = false;

      expect(component.filteredBatchActions.map((a) => a.id)).toEqual([
        "batch-archive",
        "batch-retrieve",
      ]);
    });

    it("should expose retrieve workflow handlers for batch actions", () => {
      expect(component.actionItems.handlers?.openRetrieveForm).toEqual(
        jasmine.any(Function),
      );
      expect(component.actionItems.handlers?.clearBatch).toEqual(
        jasmine.any(Function),
      );
      expect(component.actionItems.handlers?.showRetrieveError).toEqual(
        jasmine.any(Function),
      );
    });
  });

  describe("actionItems dataset sync", () => {
    it("should sync actionItems.datasets from the batch subscription", () => {
      store.overrideSelector(selectDatasetsInBatch, [dataset]);
      store.refreshState();
      expect(component.actionItems.datasets).toEqual([dataset]);
    });
  });
});
