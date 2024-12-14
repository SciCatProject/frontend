import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IIngestionRequestInformation, IngestorMetadaEditorHelper, Schema } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';
import { organizational_schema, sample_schema, scicatheader_schema } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-schematest';

@Component({
  selector: 'ingestor.user-metadata-dialog',
  templateUrl: 'ingestor.user-metadata-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../ingestor.component.scss'],
})

export class IngestorUserMetadataDialog {
  metadataSchemaOrganizational: Schema;
  metadataSchemaSample: Schema;
  scicatHeaderSchema: Schema;
  createNewTransferData: IIngestionRequestInformation = IngestorMetadaEditorHelper.createEmptyRequestInformation();
  backendURL: string = '';

  uiNextButtonReady: boolean = true; // Change to false when dev is ready

  isCardContentVisible = {
    scicat: true,
    organizational: true,
    sample: true
  };

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    const encodedSchema = data.createNewTransferData.selectedMethod.schema;
    const decodedSchema = atob(encodedSchema);
    const schema = JSON.parse(decodedSchema);
    
    console.log(schema);
    const resolvedSchema = IngestorMetadaEditorHelper.resolveRefs(schema, schema);

    console.log(resolvedSchema);

    const organizationalSchema = resolvedSchema.properties.organizational;
    const sampleSchema = resolvedSchema.properties.sample;

    console.log(organizationalSchema);
    console.log(sampleSchema);
    
    this.metadataSchemaOrganizational = organizationalSchema;
    this.metadataSchemaSample = sampleSchema;
    this.scicatHeaderSchema = scicatheader_schema;
    this.createNewTransferData = data.createNewTransferData;
    this.backendURL = data.backendURL;
  }

  onClickBack(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(0); // Beispielwert für den Schritt
    }
  }

  onClickNext(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(2); // Beispielwert für den Schritt
    }
  }

  onDataChangeUserMetadataOrganization(event: Object) {
    this.createNewTransferData.userMetaData['organization'] = event;
  }

  onDataChangeUserMetadataSample(event: Object) {
    this.createNewTransferData.userMetaData['sample'] = event;
  }

  onDataChangeUserScicatHeader(event: Object) {
    this.createNewTransferData.scicatHeader = event;
  }

  toggleCardContent(card: string): void {
    this.isCardContentVisible[card] = !this.isCardContentVisible[card];
  }
}