import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  FileUploaderComponent,
  SubmitCaptionEvent,
} from "./file-uploader.component";
import { DragAndDropDirective } from "./directives/drag-and-drop.directive";
import { SharedScicatFrontendModule } from "shared/shared.module";

describe("FileUploaderComponent", () => {
  let component: FileUploaderComponent;
  let fixture: ComponentFixture<FileUploaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedScicatFrontendModule],
      providers: [DragAndDropDirective],
      declarations: [FileUploaderComponent],
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
