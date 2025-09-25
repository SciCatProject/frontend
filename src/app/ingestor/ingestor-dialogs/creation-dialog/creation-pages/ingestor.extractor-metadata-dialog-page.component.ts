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
  APIInformation,
  IngestionRequestInformation,
  IngestorHelper,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { IngestorMetadataEditorHelper } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import { Store } from "@ngrx/store";
import {
  ingestionObjectAPIInformation,
  selectIngestionObject,
  selectIngestorRenderView,
  selectUpdateEditorFromThirdParty,
} from "state-management/selectors/ingestor.selector";
import * as fromActions from "state-management/actions/ingestor.actions";
import { Subscription } from "rxjs";
import { renderView } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component";

@Component({
  selector: "ingestor-extractor-metadata-dialog-page",
  templateUrl: "ingestor.extractor-metadata-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
  standalone: false,
})
export class IngestorExtractorMetadataDialogPageComponent
  implements OnInit, OnDestroy
{
  private subscriptions: Subscription[] = [];
  metadataSchemaInstrument: JsonSchema;
  metadataSchemaAcquisition: JsonSchema;
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();
  createNewTransferDataApiInformation: APIInformation =
    IngestorHelper.createEmptyAPIInformation();

  ingestionObjectApiInformation$ = this.store.select(
    ingestionObjectAPIInformation,
  );
  ingestionObject$ = this.store.select(selectIngestionObject);
  renderView$ = this.store.select(selectIngestorRenderView);
  selectUpdateEditorFromThirdParty$ = this.store.select(
    selectUpdateEditorFromThirdParty,
  );

  @Output() nextStep = new EventEmitter<void>();
  @Output() backStep = new EventEmitter<void>();

  activeRenderView: renderView | null = null;
  updateEditorFromThirdParty = false;
  extractorMetaDataReady = false;
  extractorMetaDataStatus = "";
  extractorMetaDataError = false;
  process = 0;

  uiNextButtonReady = false;
  isAcquisitionMetadataOk = false;
  acquisitionErrors = "";
  isInstrumentMetadataOk = false;
  instrumentErrors = "";

  isCardContentVisible = {
    instrument: true,
    acquisition: true,
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

          const instrumentSchema =
            this.createNewTransferData.selectedResolvedDecodedSchema.properties
              .instrument;
          const acqusitionSchema =
            this.createNewTransferData.selectedResolvedDecodedSchema.properties
              .acquisition;

          this.metadataSchemaInstrument = IngestorMetadataEditorHelper.removeSIFieldsFromSchema(instrumentSchema);
          this.metadataSchemaAcquisition = IngestorMetadataEditorHelper.removeSIFieldsFromSchema(acqusitionSchema);
        }
      }),
    );

    this.subscriptions.push(
      this.ingestionObjectApiInformation$.subscribe((apiInformation) => {
        if (apiInformation) {
          this.createNewTransferDataApiInformation = apiInformation;

          this.extractorMetaDataReady =
            this.createNewTransferDataApiInformation.extractorMetaDataReady;
          this.extractorMetaDataError =
            this.createNewTransferDataApiInformation.metaDataExtractionFailed;
          this.extractorMetaDataStatus =
            this.createNewTransferDataApiInformation.extractorMetaDataStatus;
          this.process =
            this.createNewTransferDataApiInformation.extractorMetadataProgress;
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

  onDataChangeExtractorMetadataInstrument(event: any) {
    this.createNewTransferData.extractorMetaData["instrument"] = event;
  }

  onDataChangeExtractorMetadataAcquisition(event: any) {
    this.createNewTransferData.extractorMetaData["acquisition"] = event;
  }

  onCreateNewTransferDataChange(updatedData: IngestionRequestInformation) {
    Object.assign(this.createNewTransferData, updatedData);
  }

  toggleCardContent(card: string): void {
    this.isCardContentVisible[card] = !this.isCardContentVisible[card];
  }

  instrumentErrorsHandler(errors: any[]) {
    const result = IngestorMetadataEditorHelper.processMetadataErrors(
      errors,
      this.metadataSchemaInstrument,
      this.activeRenderView
    );
    
    this.isInstrumentMetadataOk = result.isValid;
    this.instrumentErrors = result.errorString;
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  acquisitionErrorsHandler(errors: any[]) {
    const result = IngestorMetadataEditorHelper.processMetadataErrors(
      errors,
      this.metadataSchemaAcquisition,
      this.activeRenderView
    );
    
    this.isAcquisitionMetadataOk = result.isValid;
    this.acquisitionErrors = result.errorString;
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  validateNextButton(): void {
    /*this.uiNextButtonReady =
      this.isInstrumentMetadataOk &&
      this.isAcquisitionMetadataOk &&
      this.extractorMetaDataReady;*/

    this.uiNextButtonReady = this.extractorMetaDataReady;
  }
}
