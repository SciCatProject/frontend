import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BatchViewComponent, Share } from "./batch-view.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import {
  MockArchivingService,
  MockDatasetApi,
  MockShareGroupApi,
} from "shared/MockStubs";
import { ArchivingService } from "../archiving.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { MatDialogModule } from "@angular/material/dialog";

import { ShareGroupApi, DatasetApi, Dataset } from "shared/sdk";
import { SharedCatanieModule } from "shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { APP_CONFIG } from "app-config.module";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { DatasetState } from "state-management/state/datasets.store";
import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { removeFromBatchAction } from "state-management/actions/datasets.actions";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";

describe("BatchViewComponent", () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;

  let dispatchSpy;
  let store: MockStore<DatasetState>;

  const router = {
    navigate: jasmine.createSpy("navigate"),
  };

  beforeEach(
    waitForAsync(() => {
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
          SharedCatanieModule,
        ],
        providers: [
          provideMockStore({
            selectors: [{ selector: getDatasetsInBatch, value: [] }],
          }),
        ],
      });

      TestBed.overrideComponent(BatchViewComponent, {
        set: {
          providers: [
            { provide: ArchivingService, useClass: MockArchivingService },
            { provide: Router, useValue: router },
            { provide: ShareGroupApi, useClass: MockShareGroupApi },
            { provide: DatasetApi, useClass: MockDatasetApi },
            { provide: APP_CONFIG, useValue: { archiveWorkflowEnabled: true } },
          ],
        },
      });
      TestBed.compileComponents();

      store = TestBed.inject(MockStore);
    })
  );

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

  describe("#add()", () => {
    it("should not push event value to shareEmails if value does not exist and clear input value", () => {
      const event = {
        input: { value: "test" } as HTMLInputElement,
        value: undefined,
      };

      component.add(event);

      expect(component.shareEmails.length).toEqual(0);
      expect(event.input.value).toEqual("");
    });

    it("should push event value to shareEmails if value exists and clear input value", () => {
      const event = {
        input: { value: "test" } as HTMLInputElement,
        value: "test",
      };

      component.add(event);

      expect(component.shareEmails.length).toEqual(1);
      expect(event.input.value).toEqual("");
    });
  });

  describe("#remove()", () => {
    it("should remove value from shareEmails", () => {
      const share: Share = {
        name: "test",
      };
      component.shareEmails = [share];

      component.remove(share);

      expect(component.shareEmails.length).toEqual(0);
    });
  });

  describe("#openDialogWithoutRef()", () => {
    it("should open secondDialog", () => {
      const dialogOpenSpy = spyOn(component["dialog"], "open");

      component.openDialogWithoutRef();

      expect(dialogOpenSpy).toHaveBeenCalledOnceWith(component.secondDialog);
    });
  });

  describe("#onEmpty()", () => {
    xit("should ...", () => {});
  });

  describe("#onRemove()", () => {
    it("should dispatch a removeFromBatchAction", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const dataset = new Dataset();

      component.onRemove(dataset);

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        removeFromBatchAction({ dataset })
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
