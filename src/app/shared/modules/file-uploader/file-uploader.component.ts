import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  Input
} from "@angular/core";
import { ReadFile, ReadMode, FilePickerDirective } from "ngx-file-helpers";
import { Attachment } from "shared/sdk";

export interface SubmitCaptionEvent {
  attachmentId: string;
  caption: string;
}

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.component.html",
  styleUrls: ["./file-uploader.component.scss"]
})
export class FileUploaderComponent {
  @ViewChild(FilePickerDirective, { static: false })
  private filePicker: FilePickerDirective;

  @Input() attachments: Attachment[];

  @Output() filePicked = new EventEmitter<ReadFile>();
  @Output() readEnd = new EventEmitter<number>();
  @Output() submitCaption = new EventEmitter<SubmitCaptionEvent>();
  @Output() deleteAttachment = new EventEmitter<string>();

  public readMode = ReadMode.dataURL;
  public status: string;

  onReadStart(event: number) {
    this.status = `Started reading ${event} file(s) on ${new Date().toLocaleTimeString()}.`;
    console.log("File Uploader:", this.status);
  }

  onFilePicked(event: ReadFile) {
    this.filePicked.emit(event);
  }

  onReadEnd(event: number) {
    this.status = `Finished reading ${event} file(s) on ${new Date().toLocaleTimeString()}.`;
    console.log("File Uploader:", this.status);

    this.readEnd.emit(event);
    if (this.filePicker) {
      this.filePicker.reset();
    }
  }

  onSubmitCaption(attachmentId: string, caption: string) {
    const event: SubmitCaptionEvent = {
      attachmentId,
      caption
    };
    this.submitCaption.emit(event);
  }

  onDeleteAttachment(attachmentId: string) {
    this.deleteAttachment.emit(attachmentId);
  }
}
