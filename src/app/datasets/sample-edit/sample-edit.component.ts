import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sample-edit',
  templateUrl: './sample-edit.component.html',
  styleUrls: ['./sample-edit.component.scss']
})
export class SampleEditComponent implements OnInit {

  close(): void {
    this.dialogRef.close();
  }

  constructor(public dialogRef: MatDialogRef<SampleEditComponent>) { }

  ngOnInit(): void {
  }

}
