import { Component } from "@angular/core";
import { ReadFile, ReadMode } from "ngx-file-helpers";

@Component({
  selector: "app-file-dropzone",
  templateUrl: "./file-dropzone.component.html",
  styleUrls: ["./file-dropzone.component.css"]
})
export class FileDropzoneComponent {
  public readMode = ReadMode.dataURL;
  public isHover: boolean;
  public files: Array<ReadFile> = [];

  addFile(file: ReadFile) {
    this.files.push(file);
  }
}
