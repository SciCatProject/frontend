import {Component, OnDestroy, OnInit} from '@angular/core';
import {ViewChild} from '@angular/core';
import {Injectable, Inject} from '@angular/core';
import {Store, select} from '@ngrx/store';
import {
  Http,
  Response,
  Headers
} from '@angular/http';
import {LoopBackConfig} from 'shared/sdk/lb.config';
import {Observable} from 'rxjs/Rx';
import {OrigDatablock, Dataset, DatasetAttachment, Datablock, RawDataset, Job} from 'shared/sdk/models';
import {APP_CONFIG, AppConfig} from '../../app-config.module';

import * as lb from 'shared/sdk/services';

import {FilePickerDirective, ReadFile, ReadMode} from 'ngx-file-helpers';

import {ReadModePipe} from 'shared/pipes/index';


@Component({
  selector: 'app-file-picker-demo',
  templateUrl: './file-picker-demo.component.html',
  styleUrls: ['./file-picker-demo.component.css']
})
export class FilePickerDemoComponent implements OnInit, OnDestroy {
  dataset$: Observable<Dataset>;


  constructor(
    public http: Http,
    @Inject(APP_CONFIG) private config: AppConfig,
    private daSrv: lb.DatasetAttachmentApi,
    private store: Store<any>
  ) {
  }

  ngOnInit() {
    const currentSet$ = this.store.select(state => state.root.datasets.currentSet);
    this.dataset$ = currentSet$.distinctUntilChanged().filter((dataset: Dataset) => {
      return dataset && (Object.keys(dataset).length > 0);
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
    console.log("on readend", this.picked)
    const creds = {
      "thumbnail": this.picked._content;
      "creationTime": "2018-04-23T09:23:46.853Z",
      "datasetId": "10.17199/02a8fe6c-f830-4010-86f0-667b7fe41c4c",
      "rawDatasetId": "string",
      "derivedDatasetId": "string"
    };


    return this.daSrv.create(creds).subscribe((res) => {console.log(res);
    this.filePicker.reset();
    } );

  }

  ngOnDestroy() {
//    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
