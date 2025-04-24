import { Component, EventEmitter, inject, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  decodeBase64ToUTF8,
  ExtractionMethod,
  IngestionRequestInformation,
  IngestorHelper,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { IngestorMetadataEditorHelper } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import { GetExtractorResponse } from "shared/sdk/models/ingestor/models";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { IngestorFileBrowserComponent } from "ingestor/ingestor-dialogs/ingestor-file-browser/ingestor.file-browser.component";
import { Store } from "@ngrx/store";
import {
  selectIngestionObject,
  selectIngestorEndpoint,
  selectIngestorExtractionMethods,
} from "state-management/selectors/ingestor.selector";
import * as fromActions from "state-management/actions/ingestor.actions";

@Component({
  selector: "ingestor-new-transfer-dialog-page",
  templateUrl: "ingestor.new-transfer-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
})
export class IngestorNewTransferDialogPageComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  ingestionObject$ = this.store.select(selectIngestionObject);
  ingestorBackend$ = this.store.select(selectIngestorEndpoint);
  ingestorExtractionMethods$ = this.store.select(
    selectIngestorExtractionMethods,
  );

  @Output() nextStep = new EventEmitter<void>();
  @Output() backStep = new EventEmitter<void>();

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  extractionMethods: GetExtractorResponse = null;
  dropdownPageSize = 50;
  extractionMethodsPage = 0;

  connectedFacilityBackend = "";
  extractionMethodsError = "";

  uiNextButtonReady = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.loadExtractionMethods();

    this.ingestionObject$.subscribe((ingestionObject) => {
      if (ingestionObject) {
        this.createNewTransferData = ingestionObject;
      }
    });

    this.ingestorBackend$.subscribe((ingestorBackend) => {
      if (ingestorBackend) {
        this.connectedFacilityBackend = ingestorBackend;
      }
    });

    this.ingestorExtractionMethods$.subscribe((extractionMethods) => {
      if (extractionMethods) {
        this.extractionMethods = extractionMethods;
        this.extractionMethodsError = "";
      } else {
        this.extractionMethodsError =
          "No extraction methods available. Please check your connection.";
      }
    });
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
    this.store.dispatch(
      fromActions.getExtractionMethods({
        page: this.extractionMethodsPage + 1, // 1-based
        pageNumber: this.dropdownPageSize,
      }),
    );
  }

  generateExampleDataForSciCatHeader(): void {
    this.createNewTransferData.scicatHeader["sourceFolder"] =
      this.createNewTransferData.selectedPath;
    this.createNewTransferData.scicatHeader["keywords"] = ["OpenEM"];

    const nameWithoutPath =
      this.createNewTransferData.selectedPath.split("/|\\")[-1] ??
      this.createNewTransferData.selectedPath;
    this.createNewTransferData.scicatHeader["datasetName"] = nameWithoutPath;
    this.createNewTransferData.scicatHeader["license"] = "MIT License";
    this.createNewTransferData.scicatHeader["type"] = "raw";
    this.createNewTransferData.scicatHeader["dataFormat"] = "root";
    this.createNewTransferData.scicatHeader["owner"] = "User";

    /*this.createNewTransferData.scicatHeader["principalInvestigator"] =
      this.data.userInfo?.name ?? "";
    this.createNewTransferData.scicatHeader["investigator"] =
      this.data.userInfo?.name ?? "";
    this.createNewTransferData.scicatHeader["ownerEmail"] =
      this.data.userInfo?.email ?? "";
    this.createNewTransferData.scicatHeader["contactEmail"] =
      this.data.userInfo?.email ?? "";*/
    const creationTime = new Date();
    const formattedCreationTime = creationTime.toISOString().split("T")[0];
    this.createNewTransferData.scicatHeader["creationTime"] =
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
    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: this.createNewTransferData,
      }),
    );

    this.generateExampleDataForSciCatHeader();
    this.prepareSchemaForProcessing();
    this.nextStep.emit(); // Open next dialog
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
          backendURL: this.connectedFacilityBackend,
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
