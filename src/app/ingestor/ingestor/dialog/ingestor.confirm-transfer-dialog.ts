import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ingestor.confirm-transfer-dialog',
  templateUrl: 'ingestor.confirm-transfer-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../ingestor.component.scss'],
})

export class IngestorConfirmTransferDialog {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {}
  
  onClickBack(): void {
    console.log('Next button clicked');
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(2); // Beispielwert für den Schritt
    }
  }

  onClickConfirm(): void {
    console.log('Confirm button clicked');
    if (this.data && this.data.onClickNext) {
      this.data.onClickConfirm(); 
    }
  }
}