import { TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
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
    "archive",
    "retrieve",
    "markForDeletion",
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
    archivingServiceSpy.archive.calls.reset();
    archivingServiceSpy.retrieve.calls.reset();
    archivingServiceSpy.markForDeletion.calls.reset();
  });

  describe("registerSuccessCallback", () => {
    it("should register success callback for a job type", () => {
      const callback = jasmine.createSpy("callback");

      service.registerSuccessCallback("archive", callback);

      expect(service["successCallbacks"].get("archive")).toEqual(callback);
    });

    it("should allow overwriting existing callback", () => {
      const callback1 = jasmine.createSpy("callback1");
      const callback2 = jasmine.createSpy("callback2");

      service.registerSuccessCallback("archive", callback1);
      service.registerSuccessCallback("archive", callback2);

      expect(service["successCallbacks"].get("archive")).toEqual(callback2);
    });
  });

  describe("submitWithDialog", () => {
    it("should submit the job and execute success callback for archive", () => {
      const afterClosedSpy = jasmine.createSpy("afterClosed").and.returnValue(
        of({}),
      );
      const successCallback = jasmine.createSpy("successCallback");
      const dialogOptions = { width: "auto", data: { title: "test" } };

      dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy });
      archivingServiceSpy.archive.and.returnValue(of(void 0));
      service.registerSuccessCallback("archive", successCallback);

      service.submitJobWithDialog(
        dialogOptions,
        [mockDataset],
        "archive",
        undefined,
      );

      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      expect(archivingServiceSpy.archive).toHaveBeenCalledOnceWith([
        mockDataset,
      ]);
      expect(successCallback).toHaveBeenCalledTimes(1);
    });

    it("should submit with paramExtractor for retrieve", () => {
      const afterClosedSpy = jasmine.createSpy("afterClosed").and.returnValue(
        of({ option: "my-option", location: "/path" }),
      );
      const successCallback = jasmine.createSpy("successCallback");
      const paramExtractor = jasmine
        .createSpy("paramExtractor")
        .and.returnValue({
          destinationPath: "/archive/retrieve",
          option: "my-option",
        });
      const dialogOptions = { width: "auto", data: { title: "retrieve" } };

      dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy });
      archivingServiceSpy.retrieve.and.returnValue(of(void 0));
      service.registerSuccessCallback("retrieve", successCallback);

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
      expect(archivingServiceSpy.retrieve).toHaveBeenCalledOnceWith(
        [mockDataset],
        {
          destinationPath: "/archive/retrieve",
          option: "my-option",
        },
      );
      expect(successCallback).toHaveBeenCalledTimes(1);
    });

    it("should not submit when the dialog is cancelled", () => {
      const afterClosedSpy = jasmine.createSpy("afterClosed").and.returnValue(
        of(null),
      );
      const successCallback = jasmine.createSpy("successCallback");

      dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy });
      service.registerSuccessCallback("archive", successCallback);

      service.submitJobWithDialog(
        { width: "auto", data: { title: "test" } },
        [mockDataset],
        "archive",
        undefined,
      );

      expect(archivingServiceSpy.archive).not.toHaveBeenCalled();
      expect(successCallback).not.toHaveBeenCalled();
    });

    it("should dispatch an error message when submission fails", () => {
      const afterClosedSpy = jasmine.createSpy("afterClosed").and.returnValue(
        of({}),
      );
      const successCallback = jasmine.createSpy("successCallback");
      const dispatchSpy = spyOn(store, "dispatch");

      dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy });
      archivingServiceSpy.archive.and.returnValue(
        throwError(() => new Error("archive failed")),
      );
      service.registerSuccessCallback("archive", successCallback);

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

  describe("convenience methods", () => {
    it("should archive without dialog", () => {
      const successCallback = jasmine.createSpy("successCallback");
      service.registerSuccessCallback("archive", successCallback);

      archivingServiceSpy.archive.and.returnValue(of(void 0));

      service.archive([mockDataset]);

      expect(archivingServiceSpy.archive).toHaveBeenCalledOnceWith([
        mockDataset,
      ]);
      expect(successCallback).toHaveBeenCalledTimes(1);
    });

    it("should retrieve with additional params", () => {
      const successCallback = jasmine.createSpy("successCallback");
      const params = {
        destinationPath: "/archive/retrieve",
        option: "my-option",
      };
      service.registerSuccessCallback("retrieve", successCallback);

      archivingServiceSpy.retrieve.and.returnValue(of(void 0));

      service.retrieve([mockDataset], params);

      expect(archivingServiceSpy.retrieve).toHaveBeenCalledOnceWith(
        [mockDataset],
        params,
      );
      expect(successCallback).toHaveBeenCalledTimes(1);
    });

    it("should markForDeletion with additional params", () => {
      const successCallback = jasmine.createSpy("successCallback");
      const params = {
        deletionCode: "MARKED_FOR_DELETION",
        explanation: "reason",
      };
      service.registerSuccessCallback("markForDeletion", successCallback);

      archivingServiceSpy.markForDeletion.and.returnValue(of(void 0));

      service.markForDeletion([mockDataset], params);

      expect(archivingServiceSpy.markForDeletion).toHaveBeenCalledOnceWith(
        [mockDataset],
        params,
      );
      expect(successCallback).toHaveBeenCalledTimes(1);
    });

    it("should dispatch error for failed archive", () => {
      const dispatchSpy = spyOn(store, "dispatch");

      archivingServiceSpy.archive.and.returnValue(
        throwError(() => new Error("archive error")),
      );

      service.archive([mockDataset]);

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        showMessageAction({
          message: {
            type: MessageType.Error,
            content: "archive error",
            duration: 5000,
          },
        }),
      );
    });
  });
});
