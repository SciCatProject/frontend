/* eslint @typescript-eslint/no-empty-function:0 */

import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { DatasetTableActionsComponent } from "./dataset-table-actions.component";
import { MockStore, mockDataset } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Store, StoreModule } from "@ngrx/store";
import { DatasetViewMode } from "state-management/models";
import {
  setArchiveViewModeAction,
  addToBatchAction,
  clearBatchAction,
  clearSelectionAction,
} from "state-management/actions/datasets.actions";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { DEFAULT_DATASET_VIEW_MODES } from "datasets/dataset-view-modes.defaults";

class MockAppConfigService {
  getConfig = () => ({
    archiveWorkflowEnabled: true,
    datasetViews: { modes: DEFAULT_DATASET_VIEW_MODES },
  });
}

describe("DatasetTableActionsComponent", () => {
  let component: DatasetTableActionsComponent;
  let fixture: ComponentFixture<DatasetTableActionsComponent>;

  let store: MockStore;
  let dispatchSpy;

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
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
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

  it("should render configured view mode labels", () => {
    component.modes = [
      { id: "to-tape", label: "Ready for tape", where: {} },
      { id: "on-tape", label: "On tape", where: {} },
    ];
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll("mat-button-toggle").length).toEqual(2);
    expect(compiled.querySelector(".to-tape").textContent).toContain(
      "Ready for tape",
    );
    expect(compiled.querySelector(".archivable")).toBeFalsy();
  });

  it("should not render the mode toggles when no view modes are configured", () => {
    expect(component.appConfig.archiveWorkflowEnabled).toBeTrue();
    component.modes = [];
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("mat-button-toggle-group")).toBeFalsy();
  });

  describe("#onModeChange()", () => {
    it("should dispatch a SetViewModeAction and a clearSelectionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const viewMode: DatasetViewMode = {
        id: "on-tape",
        label: "On tape",
        where: { "datasetlifecycle.retrievable": true },
      };

      component.onModeChange(viewMode);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({
          modeToggle: "on-tape",
          mode: { "datasetlifecycle.retrievable": true },
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectionAction());
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

  describe("#archiveClickHandle()", () => {
    xit("should...", () => {});
  });

  describe("#retrieveClickHandle()", () => {
    xit("should...", () => {});
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

  describe("#onActionFinished()", () => {
    it("should clear selection and batch when action succeeded", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onActionFinished({ success: true });

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectionAction());
      expect(dispatchSpy).toHaveBeenCalledWith(clearBatchAction());
    });

    it("should not dispatch when action failed", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onActionFinished({ success: false });

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
