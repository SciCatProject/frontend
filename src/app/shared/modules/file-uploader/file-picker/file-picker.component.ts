import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Dataset, DatasetAttachment } from "shared/sdk/models";
import { FilePickerDirective, ReadFile, ReadMode } from "ngx-file-helpers";
import { AddAttachment } from "state-management/actions/datasets.actions";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "app-file-picker",
  templateUrl: "./file-picker.component.html",
  styleUrls: ["./file-picker.component.scss"]
})
export class FilePickerComponent implements OnInit, OnDestroy {
  dataset: Dataset;
  datasetSubscription: Subscription;

  public readMode = ReadMode.dataURL;
  public picked: ReadFile;
  public status: string;
  @ViewChild(FilePickerDirective, { static: false })
  private filePicker: FilePickerDirective;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
      });
  }

  ngOnDestroy() {
    this.datasetSubscription.unsubscribe();
  }

  onReadStart(fileCount: number) {
    this.status = `Now reading ${fileCount} file(s)...`;
    console.log("on readstart", this.status);
  }

  onFilePicked(file: ReadFile) {
    this.picked = file;
  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    console.log("on readend", this.status);
    console.log("on readend", this.picked);
    console.log("on readend", this.dataset);
    if (fileCount > 0) {
      const creds: DatasetAttachment = {
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
