import { Component, Output, EventEmitter, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppConfigService } from "app-config.service";
import saveAs from "file-saver";
import { Attachment } from "@scicatproject/scicat-sdk-ts-angular";
import { AttachmentService } from "shared/services/attachment.service";
import { showMessageAction } from "state-management/actions/user.actions";
import { Message, MessageType } from "state-management/models";

export interface PickedFile {
  content: string;
  name: string;
  size: number;
  type: string;
}

export interface SubmitCaptionEvent {
  attachmentId: string;
  caption: string;
}

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.component.html",
  styleUrls: ["./file-uploader.component.scss"],
})
export class FileUploaderComponent {
  appConfig = this.appConfigService.getConfig();
  maxFileUploadSizeInMb = 16;

  @Input() attachments: Attachment[] = [];
  @Output() filePicked = new EventEmitter<PickedFile>();
  @Output() submitCaption = new EventEmitter<SubmitCaptionEvent>();
  @Output() deleteAttachment = new EventEmitter<string>();

  constructor(
    private store: Store,
    private appConfigService: AppConfigService,
    private attachmentService: AttachmentService,
  ) {
    if (this.appConfig.maxFileUploadSizeInMb) {
      this.maxFileUploadSizeInMb = Number(
        this.appConfig.maxFileUploadSizeInMb.replace(
          /\D/g, // Removes any non-digit characters
          "",
        ),
      );
    }
  }

  async onFileDropped(event: unknown) {
    // base64 encoding increases the file size by 33% minimum
    const postEncodedMaxFileUploadSizeInMb = this.maxFileUploadSizeInMb * 0.67;
    const postEncodedmaxFileUploadSizeInBytes =
      postEncodedMaxFileUploadSizeInMb * 1024 * 1024;

    const files = Array.from(event as FileList);

    if (files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          if (file.size > postEncodedmaxFileUploadSizeInBytes) {
            const message = new Message(
              `File "${file.name}" exceeds the maximum size of ${postEncodedMaxFileUploadSizeInMb} MB.`,
              MessageType.Error,
              5000,
            );

            return this.store.dispatch(showMessageAction({ message }));
          }

          const buffer = await file.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buffer);
          const bytesLength = bytes.byteLength;
          for (let i = 0; i < bytesLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const pickedFile: PickedFile = {
            content: "data:" + file.type + ";base64," + btoa(binary),
            name: file.name,
            size: file.size,
            type: file.type,
          };
          this.filePicked.emit(pickedFile);
        }),
      );
    }
  }

  onFilePicked(files: FileList) {
    this.onFileDropped(files);
  }

  onSubmitCaption(attachmentId: string, caption: string) {
    const event: SubmitCaptionEvent = {
      attachmentId,
      caption,
    };
    this.submitCaption.emit(event);
  }

  onDeleteAttachment(attachmentId: string) {
    this.deleteAttachment.emit(attachmentId);
  }

  base64MimeType(encoded: string): string {
    return this.attachmentService.base64MimeType(encoded);
  }

  getImageUrl(encoded: string) {
    return this.attachmentService.getImageUrl(encoded);
  }

  openAttachment(encoded: string) {
    this.attachmentService.openAttachment(encoded);
  }

  onDownloadAttachment(attachment: Attachment) {
    const mimeType = this.base64MimeType(attachment.thumbnail);
    if (!mimeType) {
      throw new Error(
        "File type of the downloading file can not be determined",
      );
    }

    const splitMimeType = mimeType.split("/");
    const fileType = splitMimeType[splitMimeType.length - 1];

    if (!fileType) {
      throw new Error(
        "File type of the downloading file can not be determined",
      );
    }

    saveAs(
      attachment.thumbnail,
      attachment.caption || `${attachment.id}.${fileType}`,
    );
  }
}
