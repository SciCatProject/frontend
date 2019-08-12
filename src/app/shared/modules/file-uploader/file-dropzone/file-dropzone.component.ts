import { Component, OnInit, ViewChild } from "@angular/core";
import { ReadFile, ReadMode, FilePickerDirective } from "ngx-file-helpers";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { filter } from "rxjs/operators";
import { Dataset } from "shared/sdk";
import { AddAttachment } from "state-management/actions/datasets.actions";

@Component({
  selector: "app-file-dropzone",
  templateUrl: "./file-dropzone.component.html",
  styleUrls: ["./file-dropzone.component.scss"]
})
export class FileDropzoneComponent implements OnInit {
  dataset$: Observable<Dataset>;
  dataset: any;
  currentSet$: any;

  public readMode = ReadMode.dataURL;
  public picked: ReadFile;
  public status: string;
  @ViewChild(FilePickerDirective, { static: false })
  private filePicker: FilePickerDirective;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.currentSet$ = this.store.pipe(
      select(state => state.root.datasets.currentSet)
    );

    this.dataset$ = this.currentSet$.pipe(
      filter((dataset: Dataset) => {
        return dataset && Object.keys(dataset).length > 0;
      })
    );

    this.dataset$.subscribe(dataset => {
      this.dataset = dataset;
    });
  }

  onReadStart(fileCount: number) {
    this.status = `Now reading ${fileCount} file(s)...`;
  }

  onFilePicked(file: ReadFile) {
    this.picked = file;
  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    console.log("on readend", this.picked);
    console.log("on readend", this.dataset);
    if (fileCount > 0) {
      const creds = {
        thumbnail: this.picked.content,
        caption: "Some caption",
        creationTime: new Date(),
        datasetId: this.dataset.pid,
        rawDatasetId: this.dataset.pid,
        id: null,
        dataset: null,
        derivedDatasetId: this.dataset.pid
      };

      this.filePicker.reset();
      return this.store.dispatch(new AddAttachment(creds));
    }
  }
}
