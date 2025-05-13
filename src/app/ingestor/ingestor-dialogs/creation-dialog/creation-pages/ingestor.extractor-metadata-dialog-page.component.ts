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
import { convertJSONFormsErrorToString } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";
import { Store } from "@ngrx/store";
import {
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
})
export class IngestorExtractorMetadataDialogPageComponent
  implements OnInit, OnDestroy
{
  private subscriptions: Subscription[] = [];
  metadataSchemaInstrument: JsonSchema;
  metadataSchemaAcquisition: JsonSchema;
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

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

          this.metadataSchemaInstrument = instrumentSchema;
          this.metadataSchemaAcquisition = acqusitionSchema;
          this.extractorMetaDataReady =
            this.createNewTransferData.apiInformation.extractorMetaDataReady;
          this.extractorMetaDataError =
            this.createNewTransferData.apiInformation.metaDataExtractionFailed;
          this.extractorMetaDataStatus =
            this.createNewTransferData.apiInformation.extractorMetaDataStatus;
          this.process =
            this.createNewTransferData.apiInformation.extractorMetadataProgress;
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
    this.isInstrumentMetadataOk = errors.length === 0;
    this.instrumentErrors = convertJSONFormsErrorToString(errors);
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  acquisitionErrorsHandler(errors: any[]) {
    this.isAcquisitionMetadataOk = errors.length === 0;
    this.acquisitionErrors = convertJSONFormsErrorToString(errors);
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
