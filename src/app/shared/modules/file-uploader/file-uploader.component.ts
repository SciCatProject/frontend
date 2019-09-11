import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { ReadFile, ReadMode, FilePickerDirective } from "ngx-file-helpers";

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.component.html",
  styleUrls: ["./file-uploader.component.scss"]
})
export class FileUploaderComponent implements OnInit {
  constructor() {}

  @Output() filePicked = new EventEmitter<ReadFile>();
  @Output() readEnd = new EventEmitter<number>();

  public readMode = ReadMode.dataURL;
  public status: string;
  @ViewChild(FilePickerDirective, { static: false })
  private filePicker: FilePickerDirective;

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

  ngOnInit() {}
}
