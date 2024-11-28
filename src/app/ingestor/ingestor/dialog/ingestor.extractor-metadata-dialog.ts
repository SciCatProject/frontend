import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ingestor.extractor-metadata-dialog',
  templateUrl: 'ingestor.extractor-metadata-dialog.html',
  styleUrls: ['../ingestor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class IngestorExtractorMetadataDialog {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {}

  onClickBack(): void {
    console.log('Next button clicked');
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(1); // Beispielwert für den Schritt
    }
  }

  onClickNext(): void {
    console.log('Next button clicked');
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(3); // Beispielwert für den Schritt
    }
  }
}