import { Component, OnDestroy, OnInit } from "@angular/core";
import { ViewChild } from "@angular/core";
import { Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { Dataset } from "shared/sdk/models";
import { APP_CONFIG, AppConfig } from "../../app-config.module";
import * as lb from "shared/sdk/services";
import { FilePickerDirective, ReadFile, ReadMode } from "ngx-file-helpers";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-file-picker",
  templateUrl: "./file-picker.component.html",
  styleUrls: ["./file-picker.component.css"]
})
export class FilePickerComponent implements OnInit, OnDestroy {
  dataset$: Observable<Dataset>;
  dataset: any;
  subscriptions = [];

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private daSrv: lb.DatasetAttachmentApi,
    private store: Store<any>
  ) {}

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

  public readMode = ReadMode.dataURL;
  public picked: ReadFile;
  public status: string;

  @ViewChild(FilePickerDirective)
  private filePicker;

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
        creationTime: "2018-04-23T09:23:46.853Z",
        datasetId: this.dataset.pid,
        rawDatasetId: "string",
        derivedDatasetId: "string"
      };
      return this.daSrv.create(creds).subscribe(res => {
        console.log(res);
        this.filePicker.reset();
      });
    }
  }

  ngOnDestroy() {
    //    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
