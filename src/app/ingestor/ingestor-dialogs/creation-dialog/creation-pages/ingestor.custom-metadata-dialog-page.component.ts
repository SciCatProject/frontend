import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { JsonSchema } from "@jsonforms/core";
import {
  IngestionRequestInformation,
  IngestorHelper,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { IngestorMetadataEditorHelper } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import {
  selectIngestionObject,
  selectIngestorRenderView,
  selectUpdateEditorFromThirdParty,
} from "state-management/selectors/ingestor.selector";
import * as fromActions from "state-management/actions/ingestor.actions";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { renderView } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component";

@Component({
  selector: "ingestor-custom-metadata-dialog",
  templateUrl: "ingestor.custom-metadata-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
  standalone: false,
})
export class IngestorCustomMetadataDialogPageComponent
  implements OnInit, OnDestroy
{
  private subscriptions: Subscription[] = [];
  ingestionObject$ = this.store.select(selectIngestionObject);
  renderView$ = this.store.select(selectIngestorRenderView);
  selectUpdateEditorFromThirdParty$ = this.store.select(
    selectUpdateEditorFromThirdParty,
  );

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  @Output() nextStep = new EventEmitter<void>();
  @Output() backStep = new EventEmitter<void>();

  customMetadataSchema: JsonSchema;
  activeRenderView: renderView | null = null;
  updateEditorFromThirdParty = false;

  uiNextButtonReady = false;
  isCustomMetadataOk = false;
  customMetadataErrors = "";

  isCardContentVisible = {
    scientific: true,
  };

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ingestionObject$.subscribe((ingestionObject) => {
        if (ingestionObject) {
          this.createNewTransferData = ingestionObject;

          const customSchema =
            this.createNewTransferData.selectedResolvedDecodedSchema;

          if (
            // Remove all keys which start with $. Json Forms can't handle this. When preparing $refs are already resolved.
            customSchema &&
            typeof customSchema === "object" &&
            !Array.isArray(customSchema)
          ) {
            Object.keys(customSchema)
              .filter((key) => key.startsWith("$"))
              .forEach((key) => {
                delete customSchema[key];
              });
          }

          this.customMetadataSchema = customSchema;
        }
      }),
    );

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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onClickBack(): void {
    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: this.createNewTransferData,
      }),
    );

    this.backStep.emit(); // Open previous dialog
  }

  onClickNext(): void {
    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: this.createNewTransferData,
      }),
    );

    this.nextStep.emit(); // Open next dialog
  }

  onDataChangeCustomMetadata(event: any) {
    this.createNewTransferData.customMetaData = event;
  }

  onCreateNewTransferDataChange(updatedData: IngestionRequestInformation) {
    Object.assign(this.createNewTransferData, updatedData);
  }

  toggleCardContent(card: string): void {
    this.isCardContentVisible[card] = !this.isCardContentVisible[card];
  }

  customMetadataErrorsHandler(errors: any[]) {
    const result = IngestorMetadataEditorHelper.processMetadataErrors(
      errors,
      this.customMetadataSchema,
      this.activeRenderView
    );
    
    this.isCustomMetadataOk = result.isValid;
    this.customMetadataErrors = result.errorString;
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  validateNextButton(): void {
    // Don't force the user to fix all required entries
    this.uiNextButtonReady = true; //this.isCustomMetadataOk;
  }
}
