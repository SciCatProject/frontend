import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {
  decodeBase64ToUTF8,
  DialogDataObject,
  ExtractionMethod,
  IngestionRequestInformation,
  IngestorHelper,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { IngestorMetadataEditorHelper } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import { IngestorAPIManager } from "../../../ingestor-page/helper/ingestor-api-manager";
import { GetExtractorResponse } from "shared/sdk/models/ingestor/models";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { IngestorFileBrowserComponent } from "ingestor/ingestor-dialogs/ingestor-file-browser/ingestor.file-browser.component";

@Component({
  selector: "ingestor.new-transfer-dialog",
  templateUrl: "ingestor.new-transfer-dialog.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
})
export class IngestorNewTransferDialogComponent implements OnInit {
  extractionMethods: GetExtractorResponse = null;
  dropdownPageSize = 50;
  extractionMethodsPage = 0;

  backendURL = "";
  extractionMethodsError = "";

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
    const creationTime = new Date();
    const formattedCreationTime = creationTime.toISOString().split("T")[0];
    this.data.createNewTransferData.scicatHeader["creationTime"] =
      formattedCreationTime;
  }

  prepareSchemaForProcessing(): void {
    const encodedSchema = this.createNewTransferData.selectedMethod.schema;
    const decodedSchema = decodeBase64ToUTF8(encodedSchema);
    const schema = JSON.parse(decodedSchema);
    const resolvedSchema = IngestorMetadataEditorHelper.resolveRefs(
      schema,
      schema,
    );
    this.createNewTransferData.selectedResolvedDecodedSchema = resolvedSchema;
  }

  onClickRetryRequests(): void {
    this.loadExtractionMethods();
  }

  onClickNext(): void {
    if (this.data && this.data.onClickNext) {
      this.generateExampleDataForSciCatHeader();
      this.prepareSchemaForProcessing();
      this.data.onClickNext(1); // Open next dialog
    }
  }

  validateNextButton(): void {
    const selectedPathReady =
      (this.createNewTransferData.editorMode === "INGESTION" &&
        this.createNewTransferData.selectedPath !== "") ||
      this.createNewTransferData.editorMode === "EDITOR";
    const selectedMethodReady =
      this.selectedMethod !== null &&
      this.selectedMethod !== undefined &&
      this.selectedMethod.name !== "";

    this.uiNextButtonReady = !!selectedPathReady && !!selectedMethodReady;
  }

  onExtractorMethodsPageChange(event: PageChangeEvent) {
    this.extractionMethodsPage = event.pageIndex; // 0-based
    this.loadExtractionMethods();
  }

  onClickOpenFileBrowser(): void {
    this.dialog
      .open(IngestorFileBrowserComponent, {
        data: {
          backendURL: this.backendURL,
          createNewTransferData: this.createNewTransferData,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.validateNextButton();
      });
  }

  onCreateNewTransferDataChange(updatedData: IngestionRequestInformation) {
    Object.assign(this.createNewTransferData, updatedData);
    this.validateNextButton();
  }
}
