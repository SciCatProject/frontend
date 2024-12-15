import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IngestorMetadataEditorHelper } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';
import { JsonSchema } from '@jsonforms/core';
import { IDialogDataObject, IIngestionRequestInformation, IngestorHelper, SciCatHeader_Schema } from '../ingestor.component-helper';

@Component({
  selector: 'ingestor.user-metadata-dialog',
  templateUrl: 'ingestor.user-metadata-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../ingestor.component.scss'],
})

export class IngestorUserMetadataDialog {
  metadataSchemaOrganizational: JsonSchema;
  metadataSchemaSample: JsonSchema;
  scicatHeaderSchema: JsonSchema;
  createNewTransferData: IIngestionRequestInformation = IngestorHelper.createEmptyRequestInformation();
  backendURL: string = '';

  uiNextButtonReady: boolean = true; // Change to false when dev is ready

  isCardContentVisible = {
    scicat: true,
    organizational: true,
    sample: true
  };

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: IDialogDataObject) {
    this.createNewTransferData = data.createNewTransferData;
    this.backendURL = data.backendURL;
    const organizationalSchema = this.createNewTransferData.selectedResolvedDecodedSchema.properties.organizational;
    const sampleSchema = this.createNewTransferData.selectedResolvedDecodedSchema.properties.sample;
    
    this.metadataSchemaOrganizational = organizationalSchema;
    this.metadataSchemaSample = sampleSchema;
    this.scicatHeaderSchema = SciCatHeader_Schema;
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
    this.createNewTransferData.userMetaData['organizational'] = event;
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