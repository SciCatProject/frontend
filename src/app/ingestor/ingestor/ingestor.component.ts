import { Component, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { AppConfigService, HelpMessages } from "app-config.service";
import { HttpClient } from '@angular/common/http';
import { IngestorMetadataEditorComponent } from '../ingestor-metadata-editor/ingestor-metadata-editor.component';
import { ActivatedRoute, Router } from '@angular/router';

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
  forwardFacilityBackend: string = '';
  connectedFacilityBackend: string = '';
  connectingToFacilityBackend: boolean = false;
  lastUsedFacilityBackends: string[] = [];
  returnValue: string = '';

  constructor(public appConfigService: AppConfigService, private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.facility = this.appConfig.facility;
    this.ingestManual = this.appConfig.ingestManual;
    this.helpMessages = new HelpMessages(
      this.appConfig.helpMessages?.gettingStarted,
      this.appConfig.helpMessages?.ingestManual,
    );
    this.gettingStarted = this.appConfig.gettingStarted;
    this.connectingToFacilityBackend = true;
    this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
    // Get the GET parameter 'backendUrl' from the URL
    this.route.queryParams.subscribe(params => {
      const backendUrl = params['backendUrl'];
      if (backendUrl) {
        this.connectToFacilityBackend(backendUrl);
      }
      else {
        this.connectingToFacilityBackend = false;
      }
    });
  }

  connectToFacilityBackend(facilityBackendUrl: string): boolean {
    let facilityBackendUrlCleaned = facilityBackendUrl.slice();
    // Check if last symbol is a slash and add version endpoint
    if (facilityBackendUrlCleaned.slice(-1) !== '/') {
      facilityBackendUrlCleaned += '/';
    }

    let facilityBackendUrlVersion = facilityBackendUrlCleaned + 'Version';

    // Try to connect to the facility backend/version to check if it is available
    console.log('Connecting to facility backend: ' + facilityBackendUrlVersion);
    this.http.get(facilityBackendUrlVersion).subscribe(
      response => {
        console.log('Connected to facility backend', response);
        // If the connection is successful, store the connected facility backend URL
        this.connectedFacilityBackend = facilityBackendUrlCleaned;
        this.connectingToFacilityBackend = false;
      },
      error => {
        console.error('Failed to connect to facility backend', error);
        this.connectedFacilityBackend = '';
        this.connectingToFacilityBackend = false;
        this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
      }
    );

    return true;
  }

  upload() {
    this.loading = true;
    this.returnValue = '';
    const payload = {
      filePath: this.filePath,
      metaData: this.metadataEditor.metadata
    };

    console.log('Uploading', payload);

    this.http.post(this.connectedFacilityBackend + 'Dataset/Ingest', payload).subscribe(
      response => {
        console.log('Upload successful', response);
        this.returnValue = JSON.stringify(response);
        this.loading = false;
      },
      error => {
        console.error('Upload failed', error);
        this.loading = false;
      }
    );
  }

  forwardToIngestorPage() {
    if (this.forwardFacilityBackend) {
      this.router.navigate(['/ingestor'], { queryParams: { backendUrl: this.forwardFacilityBackend } });
    }
  }

  disconnectIngestor() {
    this.returnValue = '';
    this.connectedFacilityBackend = '';
    // Remove the GET parameter 'backendUrl' from the URL
    this.router.navigate(['/ingestor']);
  }

  // Helper functions
  selectFacilityBackend(facilityBackend: string) {
    this.forwardFacilityBackend = facilityBackend;
  }

  loadLastUsedFacilityBackends(): string[] {
    // Load the list from the local Storage
    const lastUsedFacilityBackends = '["http://localhost:8000"]';
    if (lastUsedFacilityBackends) {
      return JSON.parse(lastUsedFacilityBackends);
    }
    return [];
  }
}