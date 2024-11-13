import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  FileUploaderComponent,
  SubmitCaptionEvent,
} from "./file-uploader.component";
import { DragAndDropDirective } from "./directives/drag-and-drop.directive";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { showMessageAction } from "state-management/actions/user.actions";
import { Message, MessageType } from "state-management/models";
import { AppConfigService } from "app-config.service";
import { AttachmentService } from "shared/services/attachment.service";

describe("FileUploaderComponent", () => {
  let component: FileUploaderComponent;
  let fixture: ComponentFixture<FileUploaderComponent>;
  const mockAppConfigService = {
    getConfig: () => {
      return {
        maxFileUploadSizeInMb: "16mb",
      };
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedScicatFrontendModule, StoreModule.forRoot({})],
      providers: [DragAndDropDirective, AttachmentService],
      declarations: [FileUploaderComponent],
    });

    TestBed.overrideComponent(FileUploaderComponent, {
      set: {
        providers: [
          { provide: AppConfigService, useValue: mockAppConfigService },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onFileDropped()", () => {
    it("should emit the picked file", async () => {
      spyOn(component.filePicked, "emit");

      const imageBlob = new Blob([""], { type: "image/png" });
      const imageFile = {
        ...imageBlob,
        name: "image.png",
        size: 3000,
        type: "image/png",
        lastModified: 0,
        arrayBuffer: (): Promise<ArrayBuffer> =>
          new Promise((resolve, reject) => resolve(new ArrayBuffer(10))),
      } as File;

      const pdfBlob = new Blob([""], { type: "application/pdf" });
      const pdfFile = {
        ...pdfBlob,
        name: "application.pdf",
        size: 3000,
        type: "application/pdf",
        lastModified: 0,
        arrayBuffer: (): Promise<ArrayBuffer> =>
          new Promise((resolve, reject) => resolve(new ArrayBuffer(10))),
      } as File;

      const fileList = {
        0: imageFile,
        1: pdfFile,
        length: 2,
        item: (index: number): File => imageFile,
      } as FileList;

      await component.onFileDropped(fileList);

      expect(component.filePicked.emit).toHaveBeenCalledTimes(2);
    });

    it("should dispatch showMessageAction and not to emit, if file size exceeds maxFileUploadSizeInMb", async () => {
      const maxFileUploadSizeInMb = Number(
        mockAppConfigService
          .getConfig()
          .maxFileUploadSizeInMb.replace(/\D/g, ""),
      );
      const expectedMaxFileUploadSizeInMb = maxFileUploadSizeInMb * 0.67;
      spyOn(component.filePicked, "emit");
      spyOn(component["store"], "dispatch");
      const largeFileBlob = new Blob([""], { type: "application/pdf" });
      const largeFile = {
        ...largeFileBlob,
        name: "largeFile.pdf",
        size: 13 * 1024 * 1024, // 13MB
        type: "application/pdf",
        lastModified: 0,
      } as File;

      const fileList = {
        0: largeFile,
        length: 1,
        item: (index: number): File => largeFile,
      } as FileList;

      await component.onFileDropped(fileList);

      const message = new Message(
        `File "${largeFile.name}" exceeds the maximum size of ${expectedMaxFileUploadSizeInMb} MB.`,
        MessageType.Error,
        5000,
      );

      expect(component.filePicked.emit).not.toHaveBeenCalled();
      expect(component["store"].dispatch).toHaveBeenCalledTimes(1);
      expect(component["store"].dispatch).toHaveBeenCalledWith(
        showMessageAction({ message }),
      );
    });
  });

  describe("#onFilePicked()", () => {
    it("should call #onFileDropped()", () => {
      spyOn(component, "onFileDropped");

      const imageBlob = new Blob([""], { type: "image/png" });
      const imageFile = {
        ...imageBlob,
        name: "image.png",
        lastModified: 0,
      } as File;

      const pdfBlob = new Blob([""], { type: "application/pdf" });
      const pdfFile = {
        ...pdfBlob,
        name: "application.pdf",
        lastModified: 0,
      } as File;

      const fileList = {
        0: imageFile,
        1: pdfFile,
        length: 2,
        item: (index: number): File => imageFile,
      };

      component.onFilePicked(fileList);

      expect(component.onFileDropped).toHaveBeenCalledOnceWith(fileList);
    });
  });

  describe("#onSubmitCaption()", () => {
    it("should emit an event", () => {
      spyOn(component.submitCaption, "emit");

      const event: SubmitCaptionEvent = {
        attachmentId: "testId",
        caption: "test",
      };
      component.onSubmitCaption(event.attachmentId, event.caption);

      expect(component.submitCaption.emit).toHaveBeenCalledTimes(1);
      expect(component.submitCaption.emit).toHaveBeenCalledWith(event);
    });
  });

  describe("#onDeleteAttachment()", () => {
    it("should emit an event", () => {
      spyOn(component.deleteAttachment, "emit");

      const attachmentId = "testId";
      component.onDeleteAttachment(attachmentId);

      expect(component.deleteAttachment.emit).toHaveBeenCalledTimes(1);
      expect(component.deleteAttachment.emit).toHaveBeenCalledWith(
        attachmentId,
      );
    });
  });
});
