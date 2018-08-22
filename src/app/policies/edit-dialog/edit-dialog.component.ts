import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, Validators, FormGroup, FormControl} from "@angular/forms";
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
  multiEdit: boolean;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDialogComponent>,

    @Inject(MAT_DIALOG_DATA) data) {
      this.data = data;
    }




  ngOnInit() {
    this.form.addControl('selectMultiple', new FormControl(['2', '22']));
    console.log((this.data.map(function(o) { return o.ownerGroup; }).join()));
    this.ownerGroups = (this.data.map(function(o) { return o.ownerGroup; })).join();

    this.multiEdit = this.data.length > 1;
    if(!this.multiEdit){

      this.form = this.fb.group({
        ownerGroups: [this.data[0].ownerGroup , Validators.required],
        autoArchive: [this.data[0].autoArchive, Validators.required],
        manager: [this.data[0].manager, Validators.required],
        tapeRedundancy: [this.data[0].tapeRedundancy, Validators.required],
        autoArchiveDelay: [this.data[0].autoArchiveDelay, Validators.required],
        archiveEmailNotification: [this.data[0].archiveEmailNotification, Validators.required],
        archiveEmailsToBeNotified: [this.data[0].archiveEmailsToBeNotified, Validators.required],
        //archiveDelay: [data.archiveDelay, Validators.required]
      });
    }
    else{
      this.form = this.fb.group({
        ownerGroups: [this.data.map(function(o) { return o.ownerGroup; }), Validators.required]
      })
    }


  }


  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
