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
} from "../ingestor.component-helper";

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
      datasetName: this.createNewTransferData.scicatHeader["datasetName"],
      description: this.createNewTransferData.scicatHeader["description"],
      creationLocation:
        this.createNewTransferData.scicatHeader["creationLocation"],
      dataFormat: this.createNewTransferData.scicatHeader["dataFormat"],
      ownerGroup: this.createNewTransferData.scicatHeader["ownerGroup"],
      type: this.createNewTransferData.scicatHeader["type"],
      license: this.createNewTransferData.scicatHeader["license"],
      keywords: this.createNewTransferData.scicatHeader["keywords"],
      filePath: this.createNewTransferData.scicatHeader["filePath"],
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
