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

  onClickBack(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(2); // Beispielwert für den Schritt
    }
  }

  onClickConfirm(): void {
    if (this.data && this.data.onClickNext) {
      this.createNewTransferData.mergedMetaDataString =
        this.provideMergeMetaData;
      this.data.onClickNext(4);
    }
  }
}
