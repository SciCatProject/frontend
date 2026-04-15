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
  addToBatchAction,
  clearSelectionAction,
} from "state-management/actions/datasets.actions";
import { ArchivingService } from "datasets/archiving.service";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { of, throwError } from "rxjs";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { showMessageAction } from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";

class MockAppConfigService {
  getConfig = () => ({
    archiveWorkflowEnabled: true,
    markForDeletionCodes: [
      { option: "RETRIEVAL_FAILURE" },
      { option: "ARCHIVING_FAILURE" },
      { option: "MARKED_FOR_DELETION" },
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

  describe("#markForDeletionClickHandle()", () => {
    it("should submit a mark-for-deletion job and clear the selection", () => {
      const archivingService = component["archivingSrv"];
      const dialogOptions = { width: "auto", data: { title: "test" } };
      const dialogResult = {
        selectedOption: "ARCHIVING_FAILURE",
        explanation: "Marked from table actions",
      };
      const dialogRefStub = {
        afterClosed: () => of(dialogResult),
      } as unknown as MatDialogRef<DialogComponent, typeof dialogResult>;

      dispatchSpy = spyOn(store, "dispatch");
      component.selectedSets = [mockDataset];
      spyOn(component.dialog, "open").and.returnValue(dialogRefStub);
      spyOn(archivingService, "markForDeletionDialogOptions").and.returnValue(
        dialogOptions,
      );
      spyOn(archivingService, "markForDeletion").and.returnValue(of(void 0));

      component.markForDeletionClickHandle();

      expect(
        archivingService.markForDeletionDialogOptions,
      ).toHaveBeenCalledOnceWith(component.appConfig.markForDeletionCodes);
      expect(component.dialog.open).toHaveBeenCalledOnceWith(
        DialogComponent,
        dialogOptions,
      );
      expect(archivingService.markForDeletion).toHaveBeenCalledOnceWith(
        [mockDataset],
        {
          deletionCode: "ARCHIVING_FAILURE",
          explanation: "Marked from table actions",
        },
      );
      expect(dispatchSpy).toHaveBeenCalledOnceWith(clearSelectionAction());
    });

    it("should dispatch an error message if mark-for-deletion fails", () => {
      const archivingService = component["archivingSrv"];
      const dialogResult = {
        selectedOption: "ARCHIVING_FAILURE",
        explanation: "Marked from table actions",
      };
      const dialogRefStub = {
        afterClosed: () => of(dialogResult),
      } as unknown as MatDialogRef<DialogComponent, typeof dialogResult>;

      dispatchSpy = spyOn(store, "dispatch");
      component.selectedSets = [mockDataset];
      spyOn(component.dialog, "open").and.returnValue(dialogRefStub);
      spyOn(archivingService, "markForDeletionDialogOptions").and.returnValue({
        width: "auto",
        data: { title: "test" },
      });
      spyOn(archivingService, "markForDeletion").and.returnValue(
        throwError(() => new Error("mark failed")),
      );

      component.markForDeletionClickHandle();

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
