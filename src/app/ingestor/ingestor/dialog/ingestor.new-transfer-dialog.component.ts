import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { IExtractionMethod, IIngestionRequestInformation, IngestorMetadaEditorHelper } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';
import { INGESTOR_API_ENDPOINTS_V1 } from '../ingestor-api-endpoints';

@Component({
  selector: 'ingestor.new-transfer-dialog',
  templateUrl: 'ingestor.new-transfer-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../ingestor.component.scss']
})

export class IngestorNewTransferDialogComponent implements OnInit {
  extractionMethods: IExtractionMethod[] = [];
  availableFilePaths: string[] = [];
  backendURL: string = '';
  extractionMethodsError: string = '';
  availableFilePathsError: string = '';

  uiNextButtonReady: boolean = false;

  createNewTransferData: IIngestionRequestInformation = IngestorMetadaEditorHelper.createEmptyRequestInformation();

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {
    this.createNewTransferData = data.createNewTransferData;
    this.backendURL = data.backendURL;
  }

  ngOnInit(): void {
    this.apiGetExtractionMethods();
    this.apiGetAvailableFilePaths();
  }

  set selectedPath(value: string) {
    this.createNewTransferData.selectedPath = value;
    this.validateNextButton();
  }

  get selectedPath(): string {
    return this.createNewTransferData.selectedPath;
  }

  set selectedMethod(value: IExtractionMethod) {
    this.createNewTransferData.selectedMethod = value;
    this.validateNextButton();
  }

  get selectedMethod(): IExtractionMethod {
    return this.createNewTransferData.selectedMethod;
  }

  apiGetExtractionMethods(): void {
    this.http.get(this.backendURL + INGESTOR_API_ENDPOINTS_V1.EXTRACTOR).subscribe(
      (response: any) => {
        if (response.methods && response.methods.length > 0) {
          this.extractionMethods = response.methods;
        }
        else {
          this.extractionMethodsError = 'No extraction methods found.';
        }
      },
      (error: any) => {
        this.extractionMethodsError = error.message;
        console.error(this.extractionMethodsError);
      }
    );
  }

  apiGetAvailableFilePaths(): void {
    this.http.get(this.backendURL + INGESTOR_API_ENDPOINTS_V1.DATASET).subscribe(
      (response: any) => {
        if (response.datasets && response.datasets.length > 0) {
          this.availableFilePaths = response.datasets;
        }
        else {
          this.availableFilePathsError = 'No datasets found.';
        }
      },
      (error: any) => {
        this.availableFilePathsError = error.message;
        console.error(this.availableFilePathsError);
      }
    );
  }

  onClickRetryRequests(): void {
    this.apiGetExtractionMethods();
    this.apiGetAvailableFilePaths();
  }

  onClickNext(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(1); // Open next dialog
    }
  }

  validateNextButton(): void {
    this.uiNextButtonReady = !!this.createNewTransferData.selectedPath && !!this.createNewTransferData.selectedMethod?.name;
  }
}