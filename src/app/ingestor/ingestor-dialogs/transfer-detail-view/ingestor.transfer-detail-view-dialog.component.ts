import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { TransferItem } from "shared/sdk/models/ingestor/transferItem";
import * as fromActions from "state-management/actions/ingestor.actions";
import { selectIngestorTransferList } from "state-management/selectors/ingestor.selector";

@Component({
  selector: "app-ingestor-transfer-view-dialog",
  templateUrl: "./ingestor.transfer-detail-view-dialog.html",
  styleUrls: ["../../ingestor-page/ingestor.component.scss"],
  standalone: false,
})
export class IngestorTransferViewDialogComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  transferAutoRefreshIntervalDetail = 3000;
  autoRefreshInterval: NodeJS.Timeout = null;
  transferList$ = this.store.select(selectIngestorTransferList);
  detailItem: TransferItem | null = null;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<IngestorTransferViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.transferList$.subscribe((transferList) => {
        if (transferList) {
          this.detailItem = transferList.transfers?.find(
            (item) => item.transferId === this.transferId,
          );
        }
      }),
    );

    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());

    this.stopAutoRefresh();
  }

  getByteTransferRelative(): string {
    if (this.detailItem) {
      const bytesToGB = (bytes: number) => bytes / 1024 ** 3;
      return `${(
        bytesToGB(this.detailItem.bytesTransferred) /
        bytesToGB(this.detailItem.bytesTotal)
      ).toFixed(2)} %`;
    }
    return "No further information available.";
  }

  getByteTransferTotal(): string {
    if (this.detailItem) {
      const bytesToGB = (bytes: number) => bytes / 1024 ** 3;
      return `${bytesToGB(this.detailItem.bytesTotal).toFixed(3)} GB`;
    }
    return "No further information available.";
  }

  getFileTransferTotal(): string {
    if (this.detailItem) {
      return `${this.detailItem.filesTransferred} / ${this.detailItem.filesTotal} Files`;
    }
    return "No further information available.";
  }

  get transferId(): string {
    return this.data.transferId || null;
  }

  get header(): string {
    return "Transfer Details";
  }

  startAutoRefresh(): void {
    this.doRefreshTransferList(this.transferId);
    this.stopAutoRefresh();
    this.autoRefreshInterval = setInterval(() => {
      this.doRefreshTransferList(this.transferId);
    }, this.transferAutoRefreshIntervalDetail);
  }

  stopAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }

  doRefreshTransferList(
    transferId?: string,
    page?: number,
    pageNumber?: number,
  ): void {
    this.store.dispatch(
      fromActions.updateTransferList({
        transferId,
        page: page ? page + 1 : undefined,
        pageNumber: pageNumber,
      }),
    );
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
