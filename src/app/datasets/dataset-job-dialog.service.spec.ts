import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of, throwError } from "rxjs";
import { mockDataset } from "shared/MockStubs";
import { showMessageAction } from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";
import { DatasetJobDialogService } from "./dataset-job-dialog.service";
import { ArchivingService } from "./archiving.service";

describe("DatasetJobDialogService", () => {
  let service: DatasetJobDialogService;
  let store: MockStore;
  const dialogSpy = jasmine.createSpyObj("MatDialog", ["open"]);
  const archivingServiceSpy = jasmine.createSpyObj("ArchivingService", [
    "submitJob",
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatasetJobDialogService,
        provideMockStore(),
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ArchivingService, useValue: archivingServiceSpy },
      ],
    });

    service = TestBed.inject(DatasetJobDialogService);
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    dialogSpy.open.calls.reset();
    archivingServiceSpy.submitJob.calls.reset();
  });

  describe("registerSuccessCallback", () => {
    it("should register success callback", () => {
      const callback = jasmine.createSpy("callback");

      service.registerSuccessCallback(callback);

      expect(service["successCallback"].has(callback)).toBeTrue();
    });

    it("should keep multiple callbacks", () => {
      const callback1 = jasmine.createSpy("callback1");
      const callback2 = jasmine.createSpy("callback2");

      service.registerSuccessCallback(callback1);
      service.registerSuccessCallback(callback2);

      expect(service["successCallback"].size).toEqual(2);
    });
  });

  describe("submitJobWithDialog", () => {
    it("should submit the job and execute success callback for archive", () => {
      const afterClosedSpy = jasmine
        .createSpy("afterClosed")
        .and.returnValue(of({}));
      const successCallback = jasmine.createSpy("successCallback");
      const dialogOptions = { width: "auto", data: { title: "test" } };

      dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy });
      archivingServiceSpy.submitJob.and.returnValue(of(void 0));
      service.registerSuccessCallback(successCallback);

      service.submitJobWithDialog(
        dialogOptions,
        [mockDataset],
        "archive",
        undefined,
      );

      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      expect(archivingServiceSpy.submitJob).toHaveBeenCalledOnceWith(
        [mockDataset],
        "archive",
        {},
      );
      expect(successCallback).toHaveBeenCalledTimes(1);
    });

    it("should submit with paramExtractor for retrieve", () => {
      const afterClosedSpy = jasmine
        .createSpy("afterClosed")
        .and.returnValue(of({ option: "my-option", location: "/path" }));
      const successCallback = jasmine.createSpy("successCallback");
      const paramExtractor = jasmine
        .createSpy("paramExtractor")
        .and.returnValue({
          destinationPath: "/archive/retrieve",
          option: "my-option",
        });
      const dialogOptions = { width: "auto", data: { title: "retrieve" } };

      dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy });
      archivingServiceSpy.submitJob.and.returnValue(of(void 0));
      service.registerSuccessCallback(successCallback);

      service.submitJobWithDialog(
        dialogOptions,
        [mockDataset],
        "retrieve",
        paramExtractor,
      );

      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      expect(paramExtractor).toHaveBeenCalledOnceWith({
        option: "my-option",
        location: "/path",
      });
      expect(archivingServiceSpy.submitJob).toHaveBeenCalledOnceWith(
        [mockDataset],
        "retrieve",
        {
          destinationPath: "/archive/retrieve",
          option: "my-option",
        },
      );
      expect(successCallback).toHaveBeenCalledTimes(1);
    });

    it("should not submit when the dialog is cancelled", () => {
      const afterClosedSpy = jasmine
        .createSpy("afterClosed")
        .and.returnValue(of(null));
      const successCallback = jasmine.createSpy("successCallback");

      dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy });
      service.registerSuccessCallback(successCallback);

      service.submitJobWithDialog(
        { width: "auto", data: { title: "test" } },
        [mockDataset],
        "archive",
        undefined,
      );

      expect(archivingServiceSpy.submitJob).not.toHaveBeenCalled();
      expect(successCallback).not.toHaveBeenCalled();
    });

    it("should dispatch an error message when submission fails", () => {
      const afterClosedSpy = jasmine
        .createSpy("afterClosed")
        .and.returnValue(of({}));
      const successCallback = jasmine.createSpy("successCallback");
      const dispatchSpy = spyOn(store, "dispatch");

      dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy });
      archivingServiceSpy.submitJob.and.returnValue(
        throwError(() => new Error("archive failed")),
      );
      service.registerSuccessCallback(successCallback);

      service.submitJobWithDialog(
        { width: "auto", data: { title: "test" } },
        [mockDataset],
        "archive",
        undefined,
      );

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        showMessageAction({
          message: {
            type: MessageType.Error,
            content: "archive failed",
            duration: 5000,
          },
        }),
      );
      expect(successCallback).not.toHaveBeenCalled();
    });
  });
});
