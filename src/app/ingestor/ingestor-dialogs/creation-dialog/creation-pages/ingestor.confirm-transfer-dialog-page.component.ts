import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from "@angular/core";
import {
  APIInformation,
  IngestionRequestInformation,
  IngestorHelper,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { Store } from "@ngrx/store";
import {
  selectIngestionObjectAPIInformation,
  selectIngestionObject,
  selectIsIngestDatasetLoading,
} from "state-management/selectors/ingestor.selectors";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { IngestorConfirmationDialogComponent } from "ingestor/ingestor-dialogs/confirmation-dialog/ingestor.confirmation-dialog.component";
import * as fromActions from "state-management/actions/ingestor.actions";
import { Subscription } from "rxjs";

@Component({
  selector: "ingestor-confirm-transfer-dialog-page",
  templateUrl: "ingestor.confirm-transfer-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
  standalone: false,
})
export class IngestorConfirmTransferDialogPageComponent
  implements OnInit, OnDestroy
{
  private subscriptions: Subscription[] = [];
  readonly dialog = inject(MatDialog);

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();
  createNewTransferDataApiInformation: APIInformation =
    IngestorHelper.createEmptyAPIInformation();

  ingestionObjectApiInformation$ = this.store.select(
    selectIngestionObjectAPIInformation,
  );

  ingestionObject$ = this.store.select(selectIngestionObject);
  ingestDatasetLoading$ = this.store.select(selectIsIngestDatasetLoading);

  @Output() nextStep = new EventEmitter<void>();
  @Output() backStep = new EventEmitter<void>();

  provideMergeMetaData = "";

  copiedToClipboard = false;
  ingestionDatasetIsLoading = false;

  constructor(
    private store: Store,
    @Optional()
    private dialogRef: MatDialogRef<IngestorConfirmTransferDialogPageComponent>,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ingestionObject$.subscribe((ingestionObject) => {
        if (ingestionObject) {
          this.createNewTransferData = ingestionObject;
        }
      }),
    );

    this.subscriptions.push(
      this.ingestionObjectApiInformation$.subscribe((apiInformation) => {
        if (apiInformation) {
          this.createNewTransferDataApiInformation = apiInformation;
        }
      }),
    );

    this.subscriptions.push(
      this.ingestDatasetLoading$.subscribe((loading) => {
        this.ingestionDatasetIsLoading = loading;
      }),
    );

    this.provideMergeMetaData = IngestorHelper.createMetaDataString(
      this.createNewTransferData,
      this.createNewTransferData.editorMode === "CREATION",
    );
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

  onClickBack(): void {
    // Reset the ingestion request
    this.store.dispatch(fromActions.resetIngestDataset());
    this.backStep.emit(); // Open previous dialog
  }

  onClickConfirm(): void {
    const confirmDialogRef = this.dialog.open(
      IngestorConfirmationDialogComponent,
      {
        data: {
          header:
            this.createNewTransferData.editorMode === "CREATION"
              ? "Confirm creation"
              : "Confirm ingestion",
          message:
            this.createNewTransferData.editorMode === "CREATION"
              ? "Create a new dataset?"
              : "Create a new dataset and start data transfer?",
        },
      },
    );

    const dialogSub = confirmDialogRef
      .afterClosed()
      .subscribe(async (result) => {
        if (result) {
          this.createNewTransferData.mergedMetaDataString =
            this.provideMergeMetaData;

          this.nextStep.emit();

          // Close the parent dialog
          this.dialogRef?.close(result);
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
