import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IIngestionRequestInformation, IngestorMetadaEditorHelper, Schema } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';
import { acquisition_schema, instrument_schema } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-schematest';

@Component({
  selector: 'ingestor.extractor-metadata-dialog',
  templateUrl: 'ingestor.extractor-metadata-dialog.html',
  styleUrls: ['../ingestor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class IngestorExtractorMetadataDialog {
  metadataSchemaInstrument: Schema;
  metadataSchemaAcquisition: Schema;
  createNewTransferData: IIngestionRequestInformation = IngestorMetadaEditorHelper.createEmptyRequestInformation();

  backendURL: string = '';
  extractorMetaDataReady: boolean = true;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.backendURL = data.backendURL;
    this.metadataSchemaInstrument = instrument_schema;
    this.metadataSchemaAcquisition = acquisition_schema;
    this.createNewTransferData = data.createNewTransferData;
    this.extractorMetaDataReady = data.extractorMetaDataReady
  }


  onClickBack(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(1); // Beispielwert für den Schritt
    }
  }

  onClickNext(): void {
    console.log(this.createNewTransferData.selectedMethod)

    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(3); // Beispielwert für den Schritt
    }
  }

  onDataChangeUserMetadataInstrument(event: any) {
    this.createNewTransferData.extractorMetaData['instrument'] = event;
  }

  onDataChangeUserMetadataAcquisition(event: any) {
    this.createNewTransferData.extractorMetaData['acquisition'] = event;
  }
}