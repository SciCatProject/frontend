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
import { ArchViewMode, DatasetViewMode } from "state-management/models";
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

  describe("batch actions while the Selection is not empty", () => {
    it("should force them disabled with a tooltip that explains why", () => {
      component.appConfig = {
        ...component.appConfig,
        batchActions: [
          {
            id: "a",
            order: 1,
            label: "Archive",
            url: "",
            authorization: [],
            disabled: false,
            enabled: { conditions: [], enabledTooltip: "unrelated" },
          },
        ],
      } as typeof component.appConfig;

      const [action] = component["buildBatchActionsConfig"](true);

      expect(action.disabled).toBeUndefined();
      expect(action.enabled).toEqual({
        conditions: [
          {
            condition: "false",
            disabledTooltip: jasmine.stringContaining(
              "datasets are in your Selection",
            ),
          },
        ],
      });
    });

    it("should leave them unchanged when the Selection is empty", () => {
      const batchActions = [
        { id: "a", order: 1, label: "Archive", url: "", authorization: [] },
      ];
      component.appConfig = {
        ...component.appConfig,
        batchActions,
      } as typeof component.appConfig;

      expect(component["buildBatchActionsConfig"](false)).toEqual(batchActions);
    });
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

  it("should render the view modes as a dropdown when configured", () => {
    component.modesDisplay = "dropdown";
    component.modesLabel = "Tape status";
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("mat-button-toggle-group")).toBeFalsy();
    const field = compiled.querySelector("[data-cy=dataset-view-modes]");
    expect(field).toBeTruthy();
    expect(field.textContent).toContain("Tape status");
    expect(field.querySelectorAll("mat-option").length).toEqual(
      DEFAULT_DATASET_VIEW_MODES.length,
    );
  });

  it("should add an implicit All option to the dropdown when none is configured", () => {
    component.modesDisplay = "dropdown";
    component.modes = [{ id: "on-tape", label: "On tape", where: {} }];
    component.hasAllMode = false;
    fixture.detectChanges();

    const options = fixture.debugElement.nativeElement.querySelectorAll(
      "[data-cy=dataset-view-modes] mat-option",
    );
    expect(options.length).toEqual(2);
    expect(options[0].textContent).toContain("All");
  });

  describe("#onModeChange()", () => {
    it("should dispatch a SetViewModeAction and a clearSelectionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const viewMode: DatasetViewMode = {
        id: "on-tape",
        label: "On tape",
        where: { "datasetlifecycle.retrievable": true },
      };
      component.modes = [viewMode];

      component.onModeChange(viewMode.id);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({
          modeToggle: "on-tape",
          mode: { "datasetlifecycle.retrievable": true },
          checked: false,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectionAction());
    });

    it("should dispatch an empty query for the implicit All option", () => {
      dispatchSpy = spyOn(store, "dispatch");
      component.modes = [{ id: "on-tape", label: "On tape", where: {} }];

      component.onModeChange("all");

      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({
          modeToggle: "all",
          mode: {},
          checked: false,
        }),
      );
    });
  });

  describe("view mode checkbox", () => {
    const owned: DatasetViewMode = {
      id: "owned",
      label: "Owned",
      where: { "datasetlifecycle.archivable": true },
      checkbox: {
        label: "Only datasets owned by my groups",
        where: { ownerGroup: { $in: "#user.accessGroups" } },
        exemptGroups: ["admin"],
      },
    };
    const ownedOff: DatasetViewMode = {
      id: "owned-off",
      label: "Owned, unticked",
      where: {},
      checkbox: {
        label: "Only mine",
        default: false,
        where: { ownerGroup: { $in: "#user.accessGroups" } },
      },
    };
    const ownedQuery = {
      $and: [
        { "datasetlifecycle.archivable": true },
        { ownerGroup: { $in: ["p1234"] } },
      ],
    };

    beforeEach(() => {
      component.modes = [
        { id: "all", label: "All", where: {} },
        owned,
        ownedOff,
      ];
      component["user"] = { accessGroups: ["p1234"] };
    });

    it("should tick a view's checkbox by default and add its query with the user's values", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onModeChange("owned");

      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({
          modeToggle: "owned",
          mode: ownedQuery,
          checked: true,
        }),
      );
    });

    it("should leave the checkbox unticked when its default is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onModeChange("owned-off");

      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({
          modeToggle: "owned-off",
          mode: {},
          checked: false,
        }),
      );
    });

    it("should apply or remove the checkbox query for the current view and clear the selection", () => {
      dispatchSpy = spyOn(store, "dispatch");
      component.currentArchViewMode = "owned";

      component.onModeCheckboxChange(false);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({
          modeToggle: "owned",
          mode: { "datasetlifecycle.archivable": true },
          checked: false,
        }),
      );

      component.onModeCheckboxChange(true);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({
          modeToggle: "owned",
          mode: ownedQuery,
          checked: true,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectionAction());
    });

    it("should show the checkbox only for views that configure one, keeping its space otherwise", () => {
      const compiled = fixture.debugElement.nativeElement;
      component.currentArchViewMode = "all";
      fixture.detectChanges();
      const checkbox = compiled.querySelector(
        "[data-cy=dataset-view-mode-checkbox]",
      );
      expect(checkbox).toBeTruthy();
      expect(checkbox.classList).toContain("hidden");

      component.currentArchViewMode = "owned";
      fixture.detectChanges();
      expect(checkbox.classList).not.toContain("hidden");
      expect(checkbox.textContent).toContain(
        "Only datasets owned by my groups",
      );
    });

    it("should not reserve space for the checkbox when no view has one", () => {
      component.modes = [{ id: "all", label: "All", where: {} }];
      fixture.detectChanges();

      expect(
        fixture.debugElement.nativeElement.querySelector(
          "[data-cy=dataset-view-mode-checkbox]",
        ),
      ).toBeNull();
    });

    it("should neither show nor apply the checkbox for exempt users", () => {
      dispatchSpy = spyOn(store, "dispatch");
      component["user"] = { accessGroups: ["admin"] };

      component.onModeChange("owned");
      expect(dispatchSpy).toHaveBeenCalledWith(
        setArchiveViewModeAction({
          modeToggle: "owned",
          mode: { "datasetlifecycle.archivable": true },
          checked: false,
        }),
      );

      component.currentArchViewMode = "owned";
      fixture.detectChanges();
      // still there for the owned-off view, which has no exemptGroups
      expect(
        fixture.debugElement.nativeElement.querySelector(
          "[data-cy=dataset-view-mode-checkbox]",
        ).classList,
      ).toContain("hidden");
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
    it("should dispatch an addToBatchAction with the current view and a clearSelectionAction", () => {
      dispatchSpy = spyOn(store, "dispatch");
      component.currentArchViewMode = ArchViewMode.archivable;

      component.onAddToBatch();

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addToBatchAction({ addedFrom: "archivable" }),
      );
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
