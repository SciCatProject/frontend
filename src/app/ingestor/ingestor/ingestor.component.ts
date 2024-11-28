import { Component, inject, OnInit } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { INGESTOR_API_ENDPOINTS_V1 } from "./ingestor-api-endpoints";
import { IngestorNewTransferDialogComponent } from "./dialog/ingestor.new-transfer-dialog";
import { MatDialog } from "@angular/material/dialog";
import { IngestorUserMetadataDialog } from "./dialog/ingestor.user-metadata-dialog";
import { IngestorExtractorMetadataDialog } from "./dialog/ingestor.extractor-metadata-dialog";
import { IngestorConfirmTransferDialog } from "./dialog/ingestor.confirm-transfer-dialog";

interface ITransferDataListEntry {
  transferId: string;
  status: string;
}

interface IIngestionRequestInformation {
  filePath: string;
  availableMethods: string[];
  userMetaData: string;
  extractorMetaData: string;
}

@Component({
  selector: "ingestor",
  templateUrl: "./ingestor.component.html",
  styleUrls: ["./ingestor.component.scss"],
})
export class IngestorComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  filePath: string = '';
  loading: boolean = false;
  forwardFacilityBackend: string = '';

  connectedFacilityBackend: string = '';
  connectedFacilityBackendVersion: string = '';
  connectingToFacilityBackend: boolean = false;

  lastUsedFacilityBackends: string[] = [];
  
  transferDataSource: ITransferDataListEntry[] = []; // List of files to be transferred
  displayedColumns: string[] = ['transferId', 'status', 'actions'];

  errorMessage: string = '';
  returnValue: string = '';

  metadataEditorData: string = ""; // TODO

  constructor(public appConfigService: AppConfigService, private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.connectingToFacilityBackend = true;
    this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
    this.transferDataSource = [];
    // Get the GET parameter 'backendUrl' from the URL
    this.route.queryParams.subscribe(params => {
      const backendUrl = params['backendUrl'];
      if (backendUrl) {
        this.apiConnectToFacilityBackend(backendUrl);
      }
      else {
        this.connectingToFacilityBackend = false;
      }
    });
  }

  apiConnectToFacilityBackend(facilityBackendUrl: string): boolean {
    let facilityBackendUrlCleaned = facilityBackendUrl.slice();
    // Check if last symbol is a slash and add version endpoint
    if (!facilityBackendUrlCleaned.endsWith('/')) {
      facilityBackendUrlCleaned += '/';
    }

    let facilityBackendUrlVersion = facilityBackendUrlCleaned + INGESTOR_API_ENDPOINTS_V1.OTHER.VERSION;

    // Try to connect to the facility backend/version to check if it is available
    console.log('Connecting to facility backend: ' + facilityBackendUrlVersion);
    this.http.get(facilityBackendUrlVersion).subscribe(
      response => {
        console.log('Connected to facility backend', response);
        // If the connection is successful, store the connected facility backend URL
        this.connectedFacilityBackend = facilityBackendUrlCleaned;
        this.connectingToFacilityBackend = false;
        this.connectedFacilityBackendVersion = response['version'];
      },
      error => {
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
        console.error('Request failed', error);
        this.connectedFacilityBackend = '';
        this.connectingToFacilityBackend = false;
        this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
      }
    );

    return true;
  }

  apiGetTransferList(page: number, pageSize: number, transferId?: string): void {
    const params: any = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    if (transferId) {
      params.transferId = transferId;
    }
    this.http.get(this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.TRANSFER, { params }).subscribe(
      response => {
        console.log('Transfer list received', response);
        this.transferDataSource = response['transfers'];
      },
      error => {
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}]<br>`;
        console.error('Request failed', error);
      }
    );
  }

  apiUpload() {
    this.loading = true;
    this.returnValue = '';
    const payload = {
      filePath: this.filePath,
      metaData: 'todo'//this.metadataEditor.metadata
    };

    console.log('Uploading', payload);

    this.http.post(this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.DATASET, payload).subscribe(
      response => {
        console.log('Upload successful', response);
        this.returnValue = JSON.stringify(response);
        this.loading = false;
      },
      error => {
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}]<br>`;
        console.error('Upload failed', error);
        this.loading = false;
      }
    );
  }

  onClickForwardToIngestorPage() {
    if (this.forwardFacilityBackend) {
      this.connectingToFacilityBackend = true;

      // If current route is equal to the forward route, the router will not navigate to the new route
      if (this.connectedFacilityBackend === this.forwardFacilityBackend) {
        this.apiConnectToFacilityBackend(this.forwardFacilityBackend);
        return;
      }

      this.router.navigate(['/ingestor'], { queryParams: { backendUrl: this.forwardFacilityBackend } });
    }
  }

  onClickDisconnectIngestor() {
    this.returnValue = '';
    this.connectedFacilityBackend = '';
    // Remove the GET parameter 'backendUrl' from the URL
    this.router.navigate(['/ingestor']);
  }

  // Helper functions
  onClickSelectFacilityBackend(facilityBackend: string) {
    this.forwardFacilityBackend = facilityBackend;
  }

  loadLastUsedFacilityBackends(): string[] {
    // Load the list from the local Storage
    const lastUsedFacilityBackends = '["http://localhost:8000", "http://localhost:8888"]';
    if (lastUsedFacilityBackends) {
      return JSON.parse(lastUsedFacilityBackends);
    }
    return [];
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  onClickNext(step: number): void {
    console.log('Next step', step);
    this.dialog.closeAll();

    let dialogRef = null;

    switch (step) {
      case 0:
        dialogRef = this.dialog.open(IngestorNewTransferDialogComponent, {
          data: { onClickNext: this.onClickNext.bind(this), metadataEditorData: this.metadataEditorData },
          disableClose: true
        });

        break;
      case 1:
        dialogRef = this.dialog.open(IngestorUserMetadataDialog, {
          data: { onClickNext: this.onClickNext.bind(this), metadataEditorData: this.metadataEditorData },
          disableClose: true
        });
        break;
      case 2:
        dialogRef = this.dialog.open(IngestorExtractorMetadataDialog, {
          data: { onClickNext: this.onClickNext.bind(this), metadataEditorData: this.metadataEditorData },
          disableClose: true
        });
        break;
      case 3:
        dialogRef = this.dialog.open(IngestorConfirmTransferDialog, {
          data: { onClickNext: this.onClickNext.bind(this), metadataEditorData: this.metadataEditorData },
          disableClose: true
        });
        break;
      default:
        console.error('Unknown step', step);
    }

    // Error if the dialog reference is not set
    if (dialogRef === null) return;

    /*dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
  }

  onClickRefreshTransferList(): void {
    this.apiGetTransferList(1, 100);
  }

  onCancelTransfer(transferId: string) {
    console.log('Cancel transfer', transferId);
    this.http.delete(this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.TRANSFER + '/' + transferId).subscribe(
      response => {
        console.log('Transfer cancelled', response);
        this.apiGetTransferList(1, 100);
      },
      error => {
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
        console.error('Cancel transfer failed', error);
      }
    );
  }
}