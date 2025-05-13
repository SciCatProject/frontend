import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  IngestionRequestInformation,
  IngestorHelper,
  SciCatHeader,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { Store } from "@ngrx/store";
import { selectIngestionObject } from "state-management/selectors/ingestor.selector";
import { MatDialog } from "@angular/material/dialog";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { IngestorConfirmationDialogComponent } from "ingestor/ingestor-dialogs/confirmation-dialog/ingestor.confirmation-dialog.component";
import * as fromActions from "state-management/actions/ingestor.actions";
import { Subscription } from "rxjs";

@Component({
  selector: "ingestor-confirm-transfer-dialog-page",
  templateUrl: "ingestor.confirm-transfer-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
})
export class IngestorConfirmTransferDialogPageComponent
  implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  readonly dialog = inject(MatDialog);

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  ingestionObject$ = this.store.select(selectIngestionObject);

  @Output() nextStep = new EventEmitter<void>();
  @Output() backStep = new EventEmitter<void>();

  provideMergeMetaData = "";

  copiedToClipboard = false;

  constructor(private store: Store) { }

  ngOnInit() {
    this.subscriptions.push(
      this.ingestionObject$.subscribe((ingestionObject) => {
        if (ingestionObject) {
          this.createNewTransferData = ingestionObject;
        }
      }),
    );

    this.provideMergeMetaData = this.createMetaDataString();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  onAutoArchiveChange($event: MatCheckboxChange): void {
    this.createNewTransferData.autoArchive = $event.checked;

    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: this.createNewTransferData,
      }),
    );
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
    // Reset the ingestion request
    this.store.dispatch(fromActions.resetIngestDataset());
    this.backStep.emit(); // Open previous dialog
  }

  onClickConfirm(): void {
    const dialogRef = this.dialog.open(IngestorConfirmationDialogComponent, {
      data: {
        header: "Confirm ingestion",
        message: "Create a new dataset and start data transfer?",
      },
    });

    const dialogSub = dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.createNewTransferData.mergedMetaDataString =
          this.provideMergeMetaData;

        this.nextStep.emit();
      }
      dialogSub.unsubscribe();
    });
  }

  onClickRetryRequests(): void {
    this.onClickConfirm();
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
