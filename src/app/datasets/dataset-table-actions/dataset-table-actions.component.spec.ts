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
  setPublicViewModeAction,
  addToBatchAction,
  clearSelectionAction,
} from "state-management/actions/datasets.actions";
import { ArchivingService } from "datasets/archiving.service";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";

class MockAppConfigService {
  getConfig = () => ({ archiveWorkflowEnabled: true });
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
          { provide: ArchivingService, useClass: MockArchivingService },
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

  describe("#onViewPublicChange()", () => {
    it("should dispatch a SetPublicViewModeAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const viewPublic = false;
      component.onViewPublicChange(viewPublic);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setPublicViewModeAction({ isPublished: viewPublic }),
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
});
