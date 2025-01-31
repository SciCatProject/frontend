import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { JsonSchema } from "@jsonforms/core";
import {
  DialogDataObject,
  IngestionRequestInformation,
  IngestorHelper,
} from "../helper/ingestor.component-helper";

@Component({
  selector: "ingestor.extractor-metadata-dialog",
  templateUrl: "ingestor.extractor-metadata-dialog.html",
  styleUrls: ["../ingestor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngestorExtractorMetadataDialogComponent {
  metadataSchemaInstrument: JsonSchema;
  metadataSchemaAcquisition: JsonSchema;
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  backendURL = "";
  extractorMetaDataReady = false;
  extractorMetaDataError = false;

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
      this.createNewTransferData.extractorMetaDataReady;
    this.extractorMetaDataError =
      this.createNewTransferData.apiErrorInformation.metaDataExtraction;
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
    this.instrumentErrors = "";
    errors.forEach((error, number) => {
      if (error.message) {
        const ctrNum = number + 1;
        this.instrumentErrors += ctrNum + ": " + error.message + "\n";
      }
    });
    this.validateNextButton();
  }

  acquisitionErrorsHandler(errors: any[]) {
    this.isAcquisitionMetadataOk = errors.length === 0;
    this.acquisitionErrors = "";
    errors.forEach((error, number) => {
      if (error.message) {
        const ctrNum = number + 1;
        this.acquisitionErrors += ctrNum + ": " + error.message + "\n";
      }
    });
    this.validateNextButton();
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
