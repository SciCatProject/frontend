import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { INGESTOR_API_ENDPOINTS_V1 } from '../ingestor-api-endpoints';
import { IDialogDataObject, IExtractionMethod, IIngestionRequestInformation, IngestorHelper } from '../ingestor.component-helper';
import { IngestorMetadataEditorHelper } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';

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

  createNewTransferData: IIngestionRequestInformation = IngestorHelper.createEmptyRequestInformation();

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: IDialogDataObject, private http: HttpClient) {
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

  generateExampleDataForSciCatHeader(): void {
    this.data.createNewTransferData.scicatHeader['filePath'] = this.createNewTransferData.selectedPath;
    this.data.createNewTransferData.scicatHeader['keywords'] = ['OpenEM'];

    const nameWithoutPath = this.createNewTransferData.selectedPath.split('/|\\')[-1] ?? this.createNewTransferData.selectedPath;
    this.data.createNewTransferData.scicatHeader['datasetName'] = nameWithoutPath;
    this.data.createNewTransferData.scicatHeader['license'] = 'MIT License';
    this.data.createNewTransferData.scicatHeader['type'] = 'raw';
    this.data.createNewTransferData.scicatHeader['dataFormat'] = 'root';
    this.data.createNewTransferData.scicatHeader['owner'] = 'User';
  }

  prepareSchemaForProcessing(): void {
    const encodedSchema = this.createNewTransferData.selectedMethod.schema;
    const decodedSchema = atob(encodedSchema);
    const schema = JSON.parse(decodedSchema);
    const resolvedSchema = IngestorMetadataEditorHelper.resolveRefs(schema, schema);
    this.createNewTransferData.selectedResolvedDecodedSchema = resolvedSchema;
  }

  onClickRetryRequests(): void {
    this.apiGetExtractionMethods();
    this.apiGetAvailableFilePaths();
  }

  onClickNext(): void {
    if (this.data && this.data.onClickNext) {
      this.generateExampleDataForSciCatHeader();
      this.prepareSchemaForProcessing();
      this.data.onClickNext(1); // Open next dialog
    }
  }

  validateNextButton(): void {
    this.uiNextButtonReady = !!this.createNewTransferData.selectedPath && !!this.createNewTransferData.selectedMethod?.name;
  }
}