import { Component, OnInit, ViewChild } from "@angular/core";
import { AppConfigService, HelpMessages } from "app-config.service";
import { HttpClient } from '@angular/common/http';
import { IngestorMetadataEditorComponent } from '../ingestor-metadata-editor/ingestor-metadata-editor.component';

@Component({
  selector: "ingestor",
  templateUrl: "./ingestor.component.html",
  styleUrls: ["./ingestor.component.scss"],
})
export class IngestorComponent implements OnInit {
  @ViewChild(IngestorMetadataEditorComponent) metadataEditor: IngestorMetadataEditorComponent;

  appConfig = this.appConfigService.getConfig();
  facility: string | null = null;
  ingestManual: string | null = null;
  gettingStarted: string | null = null;
  shoppingCartEnabled = false;
  helpMessages: HelpMessages;
  filePath: string = '';
  loading: boolean = false;

  constructor(public appConfigService: AppConfigService, private http: HttpClient) {}

  ngOnInit() {
    this.facility = this.appConfig.facility;
    this.ingestManual = this.appConfig.ingestManual;
    this.helpMessages = new HelpMessages(
      this.appConfig.helpMessages?.gettingStarted,
      this.appConfig.helpMessages?.ingestManual,
    );
    this.gettingStarted = this.appConfig.gettingStarted;
  }

  upload() {
    this.loading = true;
    const payload = {
      metadata: this.metadataEditor.metadata,
      filePath: this.filePath
    };

    console.log('Uploading', payload);

    setTimeout(() => {
      this.loading = false;
    }, 2000);
    /*this.http.post('/api/upload', payload).subscribe(
      response => {
        console.log('Upload successful', response);
        this.loading = false;
      },
      error => {
        console.error('Upload failed', error);
        this.loading = false;
      }
    );*/
  }
}