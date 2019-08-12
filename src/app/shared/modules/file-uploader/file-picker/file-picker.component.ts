import { Component, OnInit, ViewChild } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Dataset } from "shared/sdk/models";
import { FilePickerDirective, ReadFile, ReadMode } from "ngx-file-helpers";
import { filter } from "rxjs/operators";
import { AddAttachment } from "state-management/actions/datasets.actions";

@Component({
  selector: "app-file-picker",
  templateUrl: "./file-picker.component.html",
  styleUrls: ["./file-picker.component.scss"]
})
export class FilePickerComponent implements OnInit {
  dataset$: Observable<Dataset>;
  dataset: any;
  subscriptions = [];
  public readMode = ReadMode.dataURL;
  public picked: ReadFile;
  public status: string;
  @ViewChild(FilePickerDirective, { static: false })
  private filePicker: FilePickerDirective;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    const currentSet$ = this.store.pipe(
      select(state => state.root.datasets.currentSet)
    );
    this.dataset$ = currentSet$.pipe(
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
