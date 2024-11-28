import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ingestor.new-transfer-dialog',
  templateUrl: 'ingestor.new-transfer-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../ingestor.component.scss']
})

export class IngestorNewTransferDialogComponent implements OnInit {
  filePath: string = '';
  selectedMethod: string = '';
  extractionMethods: string[] = [];

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {}

  ngOnInit(): void {
    console.log('Initialisieren');
    /*this.http.get('INGESTOR_API_ENDPOINTS_V1.extractor').subscribe((response: any) => {
      this.extractionMethods = response;
      console.log('Extraktoren geladen:', this.extractionMethods);
    });*/

    this.extractionMethods = ['Extraktor 1', 'Extraktor 2', 'Extraktor 3'];
  }

  onClickNext(): void {
    console.log('Next button clicked');
    if (this.data && this.data.onClickNext) {
      this.data.onClickNext(1); // Beispielwert für den Schritt
    }
  }
}