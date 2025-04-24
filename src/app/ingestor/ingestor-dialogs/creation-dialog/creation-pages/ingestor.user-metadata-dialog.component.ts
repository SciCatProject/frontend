import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { JsonSchema } from "@jsonforms/core";
import {
  DialogDataObject,
  IngestionRequestInformation,
  IngestorHelper,
  SciCatHeader_Schema,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { convertJSONFormsErrorToString } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper";

@Component({
  selector: "ingestor.user-metadata-dialog",
  templateUrl: "ingestor.user-metadata-dialog.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
})
export class IngestorUserMetadataDialogComponent {
  metadataSchemaOrganizational: JsonSchema;
  metadataSchemaSample: JsonSchema;
  scicatHeaderSchema: JsonSchema;
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();
  backendURL = "";

  uiNextButtonReady = false;
  isSciCatHeaderOk = false;
  scicatHeaderErrors = "";
  isOrganizationalMetadataOk = false;
  organizationalErrors = "";
  isSampleInformationOk = false;
  sampleErrors = "";

  isCardContentVisible = {
    scicat: true,
    organizational: true,
    sample: true,
  };

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataObject,
    private cdr: ChangeDetectorRef,
  ) {
    this.createNewTransferData = data.createNewTransferData;
    this.backendURL = data.backendURL;
    const organizationalSchema =
      this.createNewTransferData.selectedResolvedDecodedSchema.properties
        .organizational;
    const sampleSchema =
      this.createNewTransferData.selectedResolvedDecodedSchema.properties
        .sample;

    this.metadataSchemaOrganizational = organizationalSchema;
    this.metadataSchemaSample = sampleSchema;
    this.scicatHeaderSchema = SciCatHeader_Schema;
  }

  onClickBack(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(0); // Beispielwert für den Schritt
    }
  }

  onClickNext(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(2); // Beispielwert für den Schritt
    }
  }

  onDataChangeUserMetadataOrganization(event: any) {
    this.createNewTransferData.userMetaData["organizational"] = event;
  }

  onDataChangeUserMetadataSample(event: any) {
    this.createNewTransferData.userMetaData["sample"] = event;
  }

  onDataChangeUserScicatHeader(event: any) {
    this.createNewTransferData.scicatHeader = event;
  }

  onCreateNewTransferDataChange(updatedData: IngestionRequestInformation) {
    Object.assign(this.createNewTransferData, updatedData);
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

  organizationalErrorsHandler(errors: any[]) {
    this.isOrganizationalMetadataOk = errors.length === 0;
    this.organizationalErrors = convertJSONFormsErrorToString(errors);
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  sampleErrorsHandler(errors: any[]) {
    this.isSampleInformationOk = errors.length === 0;
    this.sampleErrors = "";
    errors.forEach((error, number) => {
      if (error.message) {
        const ctrNum = number + 1;
        this.sampleErrors += ctrNum + ": " + error.message + "\n";
      }
    });
    this.validateNextButton();
    this.cdr.detectChanges();
  }

  validateNextButton(): void {
    this.uiNextButtonReady = true;

    // Uncomment if prod
    /*this.uiNextButtonReady =
      this.isSciCatHeaderOk &&
      this.isOrganizationalMetadataOk &&
      this.isSampleInformationOk;*/
  }
}
