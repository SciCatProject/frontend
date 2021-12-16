import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  FileUploaderComponent,
  SubmitCaptionEvent,
} from "./file-uploader.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { DragAndDropDirective } from "./directives/drag-and-drop.directive";

describe("FileUploaderComponent", () => {
  let component: FileUploaderComponent;
  let fixture: ComponentFixture<FileUploaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          MatButtonModule,
          MatCardModule,
          MatFormFieldModule,
          MatIconModule,
          MatInputModule,
        ],
        providers: [DragAndDropDirective],
        declarations: [FileUploaderComponent],
      });
      TestBed.compileComponents();
    })
  );

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
    it("should emit the picked file", () => {
      spyOn(component.filePicked, "emit");

      const file = {
        name: "test",
        size: 100,
        type: "image/png",
        content: "abc123",
      };
      component.onFileDropped(file);

      expect(component.filePicked.emit).toHaveBeenCalledOnceWith(file);
    });
  });

  describe("#onFilePicked()", () => {
    it("should call #onFileDropped()", () => {
      spyOn(component, "onFileDropped");

      const fileList = new FileList();
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
        attachmentId
      );
    });
  });
});
