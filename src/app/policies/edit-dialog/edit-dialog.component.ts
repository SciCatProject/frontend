import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {EditPolicy} from "../archive-settings/EditPolicy";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { Policy } from 'state-management/models';
//import * as moment from 'moment';

@Component({
    selector: 'edit-dialog',
    templateUrl: './edit-dialog.component.html',
    styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

    form: FormGroup;
    data:[Policy];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data ) {

        this.data = data;
        this.form = fb.group({
            ownerGroup: [data[0].ownerGroup, Validators.required],
            autoArchive: [data.autoArchive, Validators.required],
            //releasedAt: [moment(), Validators.required],
            archiveDelay: [data.archiveDelay,Validators.required]
        });

    }

    ngOnInit() {
      console.log("test: ", this.data);
      //this.ownerGroup = "bob";
        //ownerGroup = "bob";
    }


    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

}
