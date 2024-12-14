import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IIngestionRequestInformation, IngestorMetadaEditorHelper } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';
import { acquisition_schema, instrument_schema } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-schematest';
import { JsonSchema } from '@jsonforms/core';

@Component({
  selector: 'ingestor.extractor-metadata-dialog',
  templateUrl: 'ingestor.extractor-metadata-dialog.html',
  styleUrls: ['../ingestor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class IngestorExtractorMetadataDialog {
  metadataSchemaInstrument: JsonSchema;
  metadataSchemaAcquisition: JsonSchema;
  createNewTransferData: IIngestionRequestInformation = IngestorMetadaEditorHelper.createEmptyRequestInformation();

  backendURL: string = '';
  extractorMetaDataReady: boolean = false;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
        const encodedSchema = data.createNewTransferData.selectedMethod.schema;
        const decodedSchema = atob(encodedSchema);
        const schema = JSON.parse(decodedSchema);
        
        const resolvedSchema = IngestorMetadaEditorHelper.resolveRefs(schema, schema);
        const instrumentSchema = resolvedSchema.properties.instrument;
        const acqusitionSchema = resolvedSchema.properties.acquisition;
        
        this.metadataSchemaInstrument = instrumentSchema;
        this.metadataSchemaAcquisition = acqusitionSchema;
        this.createNewTransferData = data.createNewTransferData;
        this.backendURL = data.backendURL;
        this.extractorMetaDataReady = true //data.extractorMetaDataReady
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