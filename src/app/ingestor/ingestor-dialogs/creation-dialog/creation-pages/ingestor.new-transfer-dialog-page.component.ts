import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
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
  selectIngestorExtractionMethods,
} from "state-management/selectors/ingestor.selector";
import * as fromActions from "state-management/actions/ingestor.actions";
import { selectUserSettingsPageViewModel } from "state-management/selectors/user.selectors";
import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts";
import { Subscription } from "rxjs";

@Component({
  selector: "ingestor-new-transfer-dialog-page",
  templateUrl: "ingestor.new-transfer-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
})
export class IngestorNewTransferDialogPageComponent
  implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  readonly dialog = inject(MatDialog);

  ingestionObject$ = this.store.select(selectIngestionObject);
  vm$ = this.store.select(selectUserSettingsPageViewModel);
  ingestorExtractionMethods$ = this.store.select(
    selectIngestorExtractionMethods,
  );

  @Output() nextStep = new EventEmitter<void>();

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  extractionMethods: GetExtractorResponse = null;
  dropdownPageSize = 50;
  extractionMethodsPage = 0;

  connectedFacilityBackend = "";
  extractionMethodsError = "";

  userProfile: ReturnedUserDto | null = null;
  uiNextButtonReady = false;

  constructor(private store: Store) { }

  ngOnInit() {
    this.loadExtractionMethods();

    // Fetch the API token that the ingestor can authenticate to scicat as the user
    this.subscriptions.push(
      this.vm$.subscribe((settings) => {
        this.userProfile = settings.user;
      }),
    );

    this.subscriptions.push(
      this.ingestionObject$.subscribe((ingestionObject) => {
        if (ingestionObject) {
          this.createNewTransferData = ingestionObject;
        }
      }),
    );

    this.subscriptions.push(
      this.ingestorExtractionMethods$.subscribe((extractionMethods) => {
        if (extractionMethods) {
          this.extractionMethods = extractionMethods;
          this.extractionMethodsError = "";
        } else {
          this.extractionMethodsError =
            "No extraction methods available. Please check your connection.";
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
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

    this.createNewTransferData.scicatHeader["principalInvestigator"] =
      this.userProfile.username;
    this.createNewTransferData.scicatHeader["investigator"] =
      this.userProfile.username;
    this.createNewTransferData.scicatHeader["ownerEmail"] =
      this.userProfile.email;
    this.createNewTransferData.scicatHeader["contactEmail"] =
      this.userProfile.email;
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
    const dialogRef = this.dialog.open(IngestorFileBrowserComponent, {
      data: {},
    });

    const dialogSub = dialogRef.afterClosed().subscribe(() => {
      this.validateNextButton();
      dialogSub.unsubscribe();
    });
  }

  onCreateNewTransferDataChange(updatedData: IngestionRequestInformation) {
    Object.assign(this.createNewTransferData, updatedData);
    this.validateNextButton();
  }
}
