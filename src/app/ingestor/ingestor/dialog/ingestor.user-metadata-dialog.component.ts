import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { JsonSchema } from "@jsonforms/core";
import {
  DialogDataObject,
  IngestionRequestInformation,
  IngestorHelper,
  SciCatHeader_Schema,
} from "../ingestor.component-helper";

@Component({
  selector: "ingestor.user-metadata-dialog",
  templateUrl: "ingestor.user-metadata-dialog.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["../ingestor.component.scss"],
})
export class IngestorUserMetadataDialogComponent {
  metadataSchemaOrganizational: JsonSchema;
  metadataSchemaSample: JsonSchema;
  scicatHeaderSchema: JsonSchema;
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();
  backendURL = "";

  uiNextButtonReady = true; // Change to false when dev is ready

  isCardContentVisible = {
    scicat: true,
    organizational: true,
    sample: true,
  };

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataObject,
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

  toggleCardContent(card: string): void {
    this.isCardContentVisible[card] = !this.isCardContentVisible[card];
  }
}
