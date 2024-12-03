import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { IIngestionRequestInformation } from '../ingestor.component'
import { IngestorMetadaEditorHelper } from 'ingestor/ingestor-metadata-editor/ingestor-metadata-editor-helper';

@Component({
  selector: 'ingestor.new-transfer-dialog',
  templateUrl: 'ingestor.new-transfer-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../ingestor.component.scss']
})

export class IngestorNewTransferDialogComponent implements OnInit {
  extractionMethods: string[] = [];
  availableFilePaths: string[] = [];

  createNewTransferData: IIngestionRequestInformation = IngestorMetadaEditorHelper.createEmptyRequestInformation();

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {
    this.createNewTransferData = data.createNewTransferData;
  }

  ngOnInit(): void {
    this.apiGetExtractionMethods();
    this.apiGetAvailableFilePaths();
  }

  apiGetExtractionMethods(): void {
    // Get reqeuest auf den Extractor endpoint
    /*this.http.get('INGESTOR_API_ENDPOINTS_V1.extractor').subscribe((response: any) => {
      this.extractionMethods = response;
      console.log('Extraktoren geladen:', this.extractionMethods);
    });*/

    const fakeData = ['Extraktor 1', 'Extraktor 2', 'Extraktor 3'];
    this.extractionMethods = fakeData;
  }

  apiGetAvailableFilePaths(): void {
    // Get request auf den Dataset endpoint
    /*this.http.get('INGESTOR_API_ENDPOINTS_V1.dataset').subscribe((response: any) => {
      this.availableFilePaths = response;
      console.log('Pfade geladen:', this.availableFilePaths);
    });*/

    const fakeData = ['Path 1', 'Path 2', 'Path 3'];
    this.availableFilePaths = fakeData;
  }

  onClickNext(): void {
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(1); // Open next dialog
    }
  }
}