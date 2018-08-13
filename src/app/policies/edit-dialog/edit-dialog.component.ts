import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { EditPolicy } from "../archive-settings/EditPolicy";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Policy } from 'state-management/models';

@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  form: FormGroup;
  data: [Policy];
  ownerGroups: string;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDialogComponent>,

    @Inject(MAT_DIALOG_DATA) data) {

    this.data = data;
    this.form = fb.group({
      ownerGroups: [data.map(function(o) { return o.ownerGroup; }), Validators.required],
      autoArchive: [data.autoArchive, Validators.required],
      archiveDelay: [data.archiveDelay, Validators.required]
    });

  }

  ngOnInit() {
    console.log((this.data.map(function(o) { return o.ownerGroup; }).join()));
    this.ownerGroups = (this.data.map(function(o) { return o.ownerGroup; })).join();

    this.data.forEach(policy => console.log(policy.manager));
    //this.form.archiveDelay.value = false;

  }


  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
