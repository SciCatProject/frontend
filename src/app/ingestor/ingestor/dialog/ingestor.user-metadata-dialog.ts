import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Schema } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';
import { schema_mask2 } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-schematest';

@Component({
  selector: 'ingestor.user-metadata-dialog',
  templateUrl: 'ingestor.user-metadata-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../ingestor.component.scss'],
})

export class IngestorUserMetadataDialog {
  metadataSchema: Schema;
  metadataEditorData: string;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.metadataSchema = schema_mask2;
    this.metadataEditorData = data.metadataEditorData;
  }

  onClickBack(): void {
    console.log('Next button clicked');
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(0); // Beispielwert für den Schritt
    }
  }

  onClickNext(): void {
    console.log('Next button clicked');
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(2); // Beispielwert für den Schritt
    }
  }

  onDataChange(event: any) {
    this.metadataEditorData = event;
    console.log(event);
  }
}