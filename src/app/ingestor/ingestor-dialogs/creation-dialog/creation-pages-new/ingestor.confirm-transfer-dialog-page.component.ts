import { Component, inject, OnInit } from "@angular/core";
import {
  IngestionRequestInformation,
  IngestorHelper,
  SciCatHeader,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { Store } from "@ngrx/store";
import {
  selectIngestionObject,
  selectIngestorEndpoint,
} from "state-management/selectors/ingestor.selector";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "ingestor-confirm-transfer-dialog-page",
  templateUrl: "ingestor.confirm-transfer-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
})
export class IngestorConfirmTransferDialogPageComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  ingestionObject$ = this.store.select(selectIngestionObject);
  ingestorBackend$ = this.store.select(selectIngestorEndpoint);

  provideMergeMetaData = "";
  connectedFacilityBackend = "";

  errorMessage = "";
  copiedToClipboard = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.ingestionObject$.subscribe((ingestionObject) => {
      if (ingestionObject) {
        this.createNewTransferData = ingestionObject;
      }
    });

    this.ingestorBackend$.subscribe((ingestorBackend) => {
      if (ingestorBackend) {
        this.connectedFacilityBackend = ingestorBackend;
      }
    });
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
    // TODO on click back
  }

  onClickConfirm(): void {
    this.errorMessage = "";
    /*if (this.data && this.data.onClickNext) {
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

            if (error.error) {
              this.errorMessage += ": " + error.error;
            }
          }
        }
      });
    }*/
  }

  onCopyMetadata(): void {
    navigator.clipboard.writeText(this.provideMergeMetaData).then(
      () => {
        this.copiedToClipboard = true;
      },
      (err) => {
        console.error("Failed to copy metadata to clipboard: ", err);
      },
    );
  }
}
