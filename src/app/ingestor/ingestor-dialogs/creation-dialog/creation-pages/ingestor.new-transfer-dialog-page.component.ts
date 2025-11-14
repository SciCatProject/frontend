import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { JsonSchema } from "@jsonforms/core";
import {
  decodeBase64ToUTF8,
  getJsonSchemaFromDto,
  ExtractionMethod,
  IngestionRequestInformation,
  IngestorHelper,
  IngestorAutodiscovery,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { convertJSONFormsErrorToString } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import { IngestorMetadataEditorHelper } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import { renderView } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component";
import { GetExtractorResponse } from "shared/sdk/models/ingestor/models";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { IngestorFileBrowserComponent } from "ingestor/ingestor-dialogs/ingestor-file-browser/ingestor.file-browser.component";
import { Store } from "@ngrx/store";
import {
  selectIngestorEndpoint,
  selectIngestionObject,
  selectIngestorExtractionMethods,
  selectIngestorRenderView,
  selectUpdateEditorFromThirdParty,
} from "state-management/selectors/ingestor.selectors";
import * as fromActions from "state-management/actions/ingestor.actions";
import { selectUserSettingsPageViewModel } from "state-management/selectors/user.selectors";
import { Subscription } from "rxjs";
import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts-angular";
import * as defaultMetadataSchema from "shared/modules/scientific-metadata/defaultMetadata.json";

@Component({
  selector: "ingestor-new-transfer-dialog-page",
  templateUrl: "ingestor.new-transfer-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
  standalone: false,
})
export class IngestorNewTransferDialogPageComponent
  implements OnInit, OnDestroy
{
  private subscriptions: Subscription[] = [];
  readonly dialog = inject(MatDialog);

  facilityBackend$ = this.store.select(selectIngestorEndpoint);
  ingestionObject$ = this.store.select(selectIngestionObject);
  vm$ = this.store.select(selectUserSettingsPageViewModel);
  ingestorExtractionMethods$ = this.store.select(
    selectIngestorExtractionMethods,
  );

  @Output() nextStep = new EventEmitter<void>();

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  facilityInfo: IngestorAutodiscovery | null = null;
  extractionMethods: GetExtractorResponse = null;
  dropdownPageSize = 50;
  extractionMethodsPage = 0;

  extractionMethodsError = "";
  extractionMethodsInitialized = false;

  userProfile: ReturnedUserDto | null = null;
  uiNextButtonReady = false;

  renderView$ = this.store.select(selectIngestorRenderView);
  selectUpdateEditorFromThirdParty$ = this.store.select(
    selectUpdateEditorFromThirdParty,
  );
  scicatHeaderSchema: JsonSchema;
  activeRenderView: renderView | null = null;
  updateEditorFromThirdParty = false;

  isSciCatHeaderOk = false;
  scicatHeaderErrors = "";

  isCardContentVisible = {
    scicat: true,
  };
  experimentalBannerDismissed = false;

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
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
          this.validateNextButton();

          if (!this.extractionMethodsInitialized) {
            this.extractionMethodsInitialized = true;

            if (
              // Only load extraction methods if the editor mode is set to INGESTION or EDITOR
              this.createNewTransferData.editorMode === "INGESTION" ||
              this.createNewTransferData.editorMode === "EDITOR"
            ) {
              this.loadExtractionMethods();

              this.subscriptions.push(
                this.ingestorExtractionMethods$.subscribe(
                  (extractionMethods) => {
                    if (extractionMethods) {
                      this.extractionMethods = extractionMethods;
                      this.extractionMethodsError = "";
                    } else {
                      this.extractionMethodsError =
                        "No extraction methods available. Please check your connection.";
                    }
                  },
                ),
              );
              this.subscriptions.push(
                this.facilityBackend$.subscribe((ingestorEndpoint) => {
                  if (ingestorEndpoint) {
                    console.log("Ingestor endpoint changed:", ingestorEndpoint);
                    this.facilityInfo = ingestorEndpoint;
                  }
                }),
              );
            } else {
              this.scicatHeaderSchema = getJsonSchemaFromDto(true);
            }
          }
        }
      }),
    );
    if (this.createNewTransferData.editorMode === "CREATION") {
      this.subscriptions.push(
        this.renderView$.subscribe((renderView) => {
          if (renderView) {
            // Check if renderView changed
            if (this.activeRenderView !== renderView) {
              this.activeRenderView = renderView;
            }
          }
        }),
      );

      this.subscriptions.push(
        this.selectUpdateEditorFromThirdParty$.subscribe((updateEditor) => {
          // We need to rerender the editor if the user has changed the metadata in the third party
          // So we get a flag, if it is true we unrender the editor
          // and then we set it to false to render it again
          this.updateEditorFromThirdParty = updateEditor;
          if (updateEditor) {
            this.cdr.detectChanges(); // Force the change detection to unrender the editor
            this.store.dispatch(
              fromActions.resetIngestionObjectFromThirdPartyFlag(),
            );
          }
        }),
      );
    }
  }

  dismissExperimentalBanner(): void {
    this.experimentalBannerDismissed = true;
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
    if (this.createNewTransferData.editorMode === "INGESTION") {
      this.createNewTransferData.scicatHeader["sourceFolder"] =
        this.createNewTransferData.selectedPath;

      const pathParts = this.createNewTransferData.selectedPath.split(/[/\\]/);
      const nameWithoutPath =
        pathParts[pathParts.length - 1] ||
        this.createNewTransferData.selectedPath;

      this.createNewTransferData.scicatHeader["datasetName"] = nameWithoutPath;
    }

    if (
      this.createNewTransferData.editorMode === "INGESTION" ||
      this.createNewTransferData.editorMode === "EDITOR"
    ) {
      this.createNewTransferData.scicatHeader["keywords"] = ["OpenEM"];
    }

    this.createNewTransferData.scicatHeader["license"] = "MIT License";
    this.createNewTransferData.scicatHeader["type"] = "raw";
    this.createNewTransferData.scicatHeader["dataFormat"] = "root";
    this.createNewTransferData.scicatHeader["owner"] = "User";

    this.createNewTransferData.scicatHeader["principalInvestigator"] =
      this.userProfile.username;
    this.createNewTransferData.scicatHeader["ownerEmail"] =
      this.userProfile.email;
    this.createNewTransferData.scicatHeader["contactEmail"] =
      this.userProfile.email;

    const creationTime = new Date();
    const formattedCreationTime = creationTime.toISOString();
    this.createNewTransferData.scicatHeader["creationTime"] =
      formattedCreationTime;
  }

  prepareSchemaForProcessing(): void {
    if (
      this.createNewTransferData.editorMode === "INGESTION" ||
      this.createNewTransferData.editorMode === "EDITOR"
    ) {
      const encodedSchema = this.createNewTransferData.selectedMethod.schema;
      const decodedSchema = decodeBase64ToUTF8(encodedSchema);
      const schema = JSON.parse(decodedSchema);
      const resolvedSchema = IngestorMetadataEditorHelper.resolveRefs(
        schema,
        schema,
      );
      this.createNewTransferData.selectedResolvedDecodedSchema = resolvedSchema;
    } else {
      if (this.createNewTransferData.selectedSchemaFileContent) {
        const schema = JSON.parse(
          this.createNewTransferData.selectedSchemaFileContent,
        );
        const resolvedSchema = IngestorMetadataEditorHelper.resolveRefs(
          schema,
          schema,
        );
        this.createNewTransferData.selectedResolvedDecodedSchema =
          resolvedSchema;
      }
    }
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

    // Emit once to go to next step
    this.nextStep.emit();
  }

  onDataChangeUserScicatHeader(event: any) {
    this.createNewTransferData.scicatHeader = event;
  }

  toggleCardContent(card: string): void {
    this.isCardContentVisible[card] = !this.isCardContentVisible[card];
  }

  scicatHeaderErrorsHandler(errors: any[]) {
    this.isSciCatHeaderOk = errors.length === 0;
    this.scicatHeaderErrors = convertJSONFormsErrorToString(errors);
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  validateNextButton(): void {
    const selectedPathReady =
      this.createNewTransferData.editorMode === "INGESTION" &&
      this.createNewTransferData.selectedPath !== "";

    const selectedMethodReady =
      this.selectedMethod !== null &&
      this.selectedMethod !== undefined &&
      this.selectedMethod.name !== "";

    if (
      this.createNewTransferData.editorMode === "INGESTION" ||
      this.createNewTransferData.editorMode === "EDITOR"
    ) {
      this.uiNextButtonReady = !!selectedPathReady && !!selectedMethodReady;
    } else if (this.createNewTransferData.editorMode === "CREATION") {
      // user can proceed without the schema
      this.uiNextButtonReady = this.isSciCatHeaderOk;
    } else {
      this.uiNextButtonReady = false;
    }
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

  onSchemaUrlChange(url: string): void {
    // Store the URL
    this.createNewTransferData.schemaUrl = url;

    // Update the store
    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: this.createNewTransferData,
      }),
    );
  }

  async onUploadSchema(): Promise<void> {
    // Don't validate if URL is empty (user may have just cleared it)
    if (
      !this.createNewTransferData.schemaUrl ||
      this.createNewTransferData.schemaUrl.trim() === ""
    ) {
      return;
    }

    console.log(
      "Fetching schema from URL:",
      this.createNewTransferData.schemaUrl,
    );

    try {
      // Fetch the schema from the URL
      const response = await fetch(this.createNewTransferData.schemaUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch schema: ${response.statusText}`);
      }

      const content = await response.text();

      // Validate that it's valid JSON
      JSON.parse(content);

      // Store the schema content
      this.createNewTransferData.selectedSchemaFileContent = content;

      // Update the store
      this.store.dispatch(
        fromActions.updateIngestionObject({
          ingestionObject: this.createNewTransferData,
        }),
      );

      this.validateNextButton();
    } catch (error: any) {
      // Clear both URL and content on error
      this.createNewTransferData.schemaUrl = "";
      this.createNewTransferData.selectedSchemaFileContent = "";

      // Update the store with cleared values
      this.store.dispatch(
        fromActions.updateIngestionObject({
          ingestionObject: this.createNewTransferData,
        }),
      );

      // Show appropriate error message
      if (error instanceof SyntaxError) {
        alert("The provided URL does not contain valid JSON.");
      } else {
        alert(`Error fetching schema: ${error.message}.`);
      }
      console.error("Error loading schema from URL:", error);

      this.validateNextButton();
    }
  }

  onUploadSchemaFile(): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;

          try {
            // Validate that it's valid JSON
            JSON.parse(content);

            this.createNewTransferData.selectedSchemaFileContent = content;

            // Clear the URL since we're loading from file
            this.createNewTransferData.schemaUrl = "";

            // Update the store
            this.store.dispatch(
              fromActions.updateIngestionObject({
                ingestionObject: this.createNewTransferData,
              }),
            );

            this.validateNextButton();
          } catch (error) {
            alert("The selected file does not contain valid JSON.");
            console.error("Error parsing JSON file:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  onLoadDefaultSchema(): void {
    try {
      // Convert the imported schema to a string
      const content = JSON.stringify(defaultMetadataSchema, null, 2);

      // Store the schema content
      this.createNewTransferData.selectedSchemaFileContent = content;

      // Clear the URL since we're loading from default schema
      this.createNewTransferData.schemaUrl = "";

      this.store.dispatch(
        fromActions.updateIngestionObject({
          ingestionObject: this.createNewTransferData,
        }),
      );

      this.validateNextButton();
    } catch (error) {
      alert("Error loading default schema.");
      console.error("Error loading default schema:", error);
    }
  }
}
