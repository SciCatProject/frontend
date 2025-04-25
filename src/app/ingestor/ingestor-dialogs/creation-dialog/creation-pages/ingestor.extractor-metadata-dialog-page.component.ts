import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
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
import { selectIngestionObject } from "state-management/selectors/ingestor.selector";
import * as fromActions from "state-management/actions/ingestor.actions";

@Component({
  selector: "ingestor-extractor-metadata-dialog-page",
  templateUrl: "ingestor.extractor-metadata-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
})
export class IngestorExtractorMetadataDialogPageComponent implements OnInit {
  metadataSchemaInstrument: JsonSchema;
  metadataSchemaAcquisition: JsonSchema;
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  ingestionObject$ = this.store.select(selectIngestionObject);

  @Output() nextStep = new EventEmitter<void>();
  @Output() backStep = new EventEmitter<void>();

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
    });
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

    // TODO: Use upper line if schema values are fine
    this.uiNextButtonReady = this.extractorMetaDataReady;
  }
}
