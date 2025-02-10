import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {
  DialogDataObject,
  ExtractionMethod,
  IngestionRequestInformation,
  IngestorHelper,
} from "../helper/ingestor.component-helper";
import { IngestorMetadataEditorHelper } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import { IngestorAPIManager } from "../helper/ingestor-api-manager";
import {
  GetDatasetResponse,
  GetExtractorResponse,
} from "ingestor/model/models";
import { PageChangeEvent } from "shared/modules/table/table.component";

@Component({
  selector: "ingestor.new-transfer-dialog",
  templateUrl: "ingestor.new-transfer-dialog.html",
  styleUrls: ["../ingestor.component.scss"],
})
export class IngestorNewTransferDialogComponent implements OnInit {
  extractionMethods: GetExtractorResponse = null;
  availableFilePaths: GetDatasetResponse = null;
  dropdownPageSize = 50;
  extractionMethodsPage = 0;
  availableFilePathsPage = 0;

  backendURL = "";
  extractionMethodsError = "";
  availableFilePathsError = "";

  uiNextButtonReady = false;

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataObject,
    private apiManager: IngestorAPIManager,
  ) {
    this.createNewTransferData = data.createNewTransferData;
    this.backendURL = data.backendURL;
    this.apiManager.connect(this.backendURL);
  }

  ngOnInit(): void {
    this.loadExtractionMethods();
    this.loadAvailableFilePaths();
  }

  set selectedPath(value: string) {
    this.createNewTransferData.selectedPath = value;
    this.validateNextButton();
  }

  get selectedPath(): string {
    return this.createNewTransferData.selectedPath;
  }

  set selectedMethod(value: ExtractionMethod) {
    this.createNewTransferData.selectedMethod = value;
    this.validateNextButton();
  }

  get selectedMethod(): ExtractionMethod {
    return this.createNewTransferData.selectedMethod;
  }

  async loadExtractionMethods(): Promise<void> {
    try {
      this.extractionMethods = await this.apiManager.getExtractionMethods(
        this.extractionMethodsPage + 1, // 1-based
        this.dropdownPageSize,
      );
    } catch (error) {
      this.extractionMethodsError = error.message;
      console.error(this.extractionMethodsError);
    }
  }

  async loadAvailableFilePaths(): Promise<void> {
    try {
      this.availableFilePaths = await this.apiManager.getAvailableFilePaths(
        this.availableFilePathsPage + 1, // 1-based
        this.dropdownPageSize,
      );
      if (this.availableFilePaths.total === 0) {
        this.availableFilePathsError = "No datasets found.";
      }
    } catch (error) {
      this.availableFilePathsError = error.message;
      console.error(this.extractionMethodsError);
    }
  }

  generateExampleDataForSciCatHeader(): void {
    this.data.createNewTransferData.scicatHeader["sourceFolder"] =
      this.createNewTransferData.selectedPath;
    this.data.createNewTransferData.scicatHeader["keywords"] = ["OpenEM"];

    const nameWithoutPath =
      this.createNewTransferData.selectedPath.split("/|\\")[-1] ??
      this.createNewTransferData.selectedPath;
    this.data.createNewTransferData.scicatHeader["datasetName"] =
      nameWithoutPath;
    this.data.createNewTransferData.scicatHeader["license"] = "MIT License";
    this.data.createNewTransferData.scicatHeader["type"] = "raw";
    this.data.createNewTransferData.scicatHeader["dataFormat"] = "root";
    this.data.createNewTransferData.scicatHeader["owner"] = "User";

    this.data.createNewTransferData.scicatHeader["principalInvestigator"] =
      this.data.userInfo?.name ?? "";
    this.data.createNewTransferData.scicatHeader["investigator"] =
      this.data.userInfo?.name ?? "";
    this.data.createNewTransferData.scicatHeader["ownerEmail"] =
      this.data.userInfo?.email ?? "";
    this.data.createNewTransferData.scicatHeader["contactEmail"] =
      this.data.userInfo?.email ?? "";
    this.data.createNewTransferData.scicatHeader["creationTime"] =
      new Date().toDateString();
  }

  prepareSchemaForProcessing(): void {
    const encodedSchema = this.createNewTransferData.selectedMethod.schema;
    const decodedSchema = atob(encodedSchema);
    const schema = JSON.parse(decodedSchema);
    const resolvedSchema = IngestorMetadataEditorHelper.resolveRefs(
      schema,
      schema,
    );
    this.createNewTransferData.selectedResolvedDecodedSchema = resolvedSchema;
  }

  onClickRetryRequests(): void {
    this.loadExtractionMethods();
    this.loadAvailableFilePaths();
  }

  onClickNext(): void {
    if (this.data && this.data.onClickNext) {
      this.generateExampleDataForSciCatHeader();
      this.prepareSchemaForProcessing();
      this.data.onClickNext(1); // Open next dialog
    }
  }

  validateNextButton(): void {
    this.uiNextButtonReady =
      !!this.createNewTransferData.selectedPath &&
      !!this.createNewTransferData.selectedMethod?.name;
  }

  onAvailablePathPageChange(event: PageChangeEvent) {
    this.availableFilePathsPage = event.pageIndex; // 0-based
    this.loadAvailableFilePaths();
  }

  onExtractorMethodsPageChange(event: PageChangeEvent) {
    this.extractionMethodsPage = event.pageIndex; // 0-based
    this.loadExtractionMethods();
  }
}
