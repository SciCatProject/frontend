/* eslint @typescript-eslint/no-empty-function:0 */

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BatchViewComponent } from "./batch-view.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import {
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

describe("BatchViewComponent", () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;

  let dispatchSpy;
  let store: MockStore<DatasetState>;

  const router = {
    navigate: jasmine.createSpy("navigate"),
  };

  const getConfig = () => ({
    archiveWorkflowEnabled: true,
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
    it("should navigate to datasets/batch/publish", () => {
      component.onPublish();

      expect(component["router"].navigate).toHaveBeenCalledOnceWith([
        "datasets",
        "batch",
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
});
