/* eslint @typescript-eslint/no-empty-function:0 */

import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { DatasetTableActionsComponent } from "./dataset-table-actions.component";
import { MockStore, mockDataset } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA, SimpleChange } from "@angular/core";
import { Store, StoreModule } from "@ngrx/store";
import { ArchViewMode } from "state-management/models";
import {
  setArchiveViewModeAction,
  addToBatchAction,
  clearSelectionAction,
} from "state-management/actions/datasets.actions";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { ActionConfig } from "shared/modules/configurable-actions/configurable-action.interfaces";

const selectionActions: ActionConfig[] = [
  {
    id: "archive-action",
    order: 1,
    label: "Archive",
    mat_icon: "archive",
    type: "form",
    url: "/api/v3/jobs/archive",
    target: "_blank",
    archiveViewMode: "archivable",
  },
  {
    id: "retrieve-action",
    order: 2,
    label: "Retrieve",
    mat_icon: "cloud_upload",
    type: "form",
    url: "/api/v3/jobs/retrieve",
    target: "_blank",
    archiveViewMode: "retrievable",
  },
  {
    id: "mark-for-deletion-action",
    order: 3,
    label: "Mark for Deletion",
    mat_icon: "delete",
    type: "form",
    url: "/api/v3/jobs/mark-for-deletion",
    target: "_blank",
    archiveViewMode: "retrievable",
    requiresMarkForDeletionCodes: true,
  },
];

class MockAppConfigService {
  getConfig = () => ({
    archiveWorkflowEnabled: true,
    datasetSelectionActionsEnabled: true,
    datasetSelectionActions: selectionActions,
    shoppingCartEnabled: true,
    markForDeletionCodes: [
      "RETRIEVAL_FAILURE",
      "ARCHIVING_FAILURE",
      "MARKED_FOR_DELETION",
    ],
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

  describe("#filteredSelectionActions", () => {
    it("should expose archivable actions in archivable mode", () => {
      component.currentArchViewMode = ArchViewMode.archivable;

      expect(component.filteredSelectionActions.map((a) => a.id)).toEqual([
        "archive-action",
      ]);
    });

    it("should expose retrievable actions in retrievable mode", () => {
      component.currentArchViewMode = ArchViewMode.retrievable;

      expect(component.filteredSelectionActions.map((a) => a.id)).toEqual([
        "retrieve-action",
        "mark-for-deletion-action",
      ]);
    });

    it("should hide deletion action when codes are not configured", () => {
      component.markForDeletion = false;
      component.currentArchViewMode = ArchViewMode.retrievable;

      expect(component.filteredSelectionActions.map((a) => a.id)).toEqual([
        "retrieve-action",
      ]);
    });
  });

  describe("#ngOnChanges()", () => {
    it("should sync configurable action datasets from selected sets", () => {
      component.selectedSets = [mockDataset];

      component.ngOnChanges({
        selectedSets: new SimpleChange([], component.selectedSets, false),
      });

      expect(component.actionItems.datasets).toEqual([mockDataset]);
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
