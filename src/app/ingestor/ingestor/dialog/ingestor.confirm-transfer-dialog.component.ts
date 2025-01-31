import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  DialogDataObject,
  IngestionRequestInformation,
  IngestorHelper,
  SciCatHeader,
} from "../helper/ingestor.component-helper";
import { IngestorConfirmationDialogComponent } from "./confirmation-dialog/ingestor.confirmation-dialog.component";

@Component({
  selector: "ingestor.confirm-transfer-dialog",
  templateUrl: "ingestor.confirm-transfer-dialog.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["../ingestor.component.scss"],
})
export class IngestorConfirmTransferDialogComponent implements OnInit {
  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();
  provideMergeMetaData = "";
  backendURL = "";
  errorMessage = "";

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataObject,
  ) {
    this.createNewTransferData = data.createNewTransferData;
    this.backendURL = data.backendURL;
  }

  ngOnInit() {
    this.provideMergeMetaData = this.createMetaDataString();
  }

  createMetaDataString(): string {
    const space = 2;
    const scicatMetadata: SciCatHeader = {
      ...(this.createNewTransferData.scicatHeader as SciCatHeader),
      scientificMetadata: {
        organizational:
          this.createNewTransferData.userMetaData["organizational"],
        sample: this.createNewTransferData.userMetaData["sample"],
        acquisition:
          this.createNewTransferData.extractorMetaData["acquisition"],
        instrument: this.createNewTransferData.extractorMetaData["instrument"],
      },
    };

    return JSON.stringify(scicatMetadata, null, space);
  }

  onCreateNewTransferDataChange(updatedData: IngestionRequestInformation) {
    Object.assign(this.createNewTransferData, updatedData);
  }

  clearErrorMessage(): void {
    this.errorMessage = "";
  }

  onClickBack(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(2);
    }
  }

  onClickConfirm(): void {
    this.errorMessage = "";
    if (this.data && this.data.onClickNext) {
      const dialogRef = this.dialog.open(IngestorConfirmationDialogComponent, {
        data: {
          header: "Confirm ingestion",
          message: "Create a new dataset and start data transfer?",
        },
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          this.createNewTransferData.mergedMetaDataString =
            this.provideMergeMetaData;
          try {
            const success = await this.data.onStartUpload();
            if (success) {
              this.data.onClickNext(4);
            }
          } catch (error) {
            this.errorMessage = error.message;
          }
        }
      });
    }
  }
}
