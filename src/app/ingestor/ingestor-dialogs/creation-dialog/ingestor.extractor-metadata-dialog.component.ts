import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { JsonSchema } from "@jsonforms/core";
import {
  DialogDataObject,
  IngestionRequestInformation,
  IngestorHelper,
} from "../../ingestor-page/helper/ingestor.component-helper";
import { convertJSONFormsErrorToString } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";

@Component({
  selector: "ingestor.extractor-metadata-dialog",
  templateUrl: "ingestor.extractor-metadata-dialog.html",
  styleUrls: ["../../ingestor-page/ingestor.component.scss"],
})
export class IngestorExtractorMetadataDialogComponent {
  metadataSchemaInstrument: JsonSchema;
  metadataSchemaAcquisition: JsonSchema;
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  backendURL = "";
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
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataObject,
    private cdr: ChangeDetectorRef,
  ) {
    this.createNewTransferData = data.createNewTransferData;
    this.backendURL = data.backendURL;
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

  onClickBack(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(1); // Beispielwert für den Schritt
    }
  }

  onClickNext(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(3); // Beispielwert für den Schritt
    }
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
