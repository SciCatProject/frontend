import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IIngestionRequestInformation } from '../ingestor.component';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { IngestorMetadaEditorHelper } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';

@Component({
  selector: 'ingestor.confirm-transfer-dialog',
  templateUrl: 'ingestor.confirm-transfer-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../ingestor.component.scss'],
})

export class IngestorConfirmTransferDialog {
  createNewTransferData: IIngestionRequestInformation = IngestorMetadaEditorHelper.createEmptyRequestInformation();
  provideMergeMetaData: string = '';

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createNewTransferData = data.createNewTransferData;
  }

  ngOnInit() {
    const space = 2;
    this.provideMergeMetaData = IngestorMetadaEditorHelper.mergeUserAndExtractorMetadata(this.createNewTransferData.userMetaData, this.createNewTransferData.extractorMetaData, space);
  }

  onClickBack(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(2); // Beispielwert für den Schritt
    }
  }

  onClickConfirm(): void {
    if (this.data && this.data.onClickNext) {
      this.createNewTransferData.mergedMetaDataString = this.provideMergeMetaData;
      this.data.onClickConfirm();
    }
  }
}