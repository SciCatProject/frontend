import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "edit-dialog",
  templateUrl: "./edit-dialog.component.html",
  styleUrls: ["./edit-dialog.component.scss"]
})
export class EditDialogComponent implements /*OnChanges,*/ OnInit {
  data: any;
  multiEdit: boolean;
  selectedGroups: string[];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data;
    this.multiEdit = data.multiSelect;

    this.form = new FormGroup({
      autoArchive: new FormControl({
        value:
          this.getPreFill(data.selectedPolicy.autoArchive, this.multiEdit),
        disabled: true
        /*, Validators.required*/
      }),
      tapeRedundancy: new FormControl({
        value:
          this.getPreFill(data.selectedPolicy.tapeRedundancy, this.multiEdit),
        disabled: true
      }),
      autoArchiveDelay: new FormControl({
        value:
          this.getPreFill(data.selectedPolicy.autoArchiveDelay, this.multiEdit),
        disabled: true
      }),
      archiveEmailNotification: new FormControl({
        value: this.getPreFill(data.selectedPolicy.archiveEmailNotification, this.multiEdit),
        disabled: true
      }),
      archiveEmailsToBeNotified: new FormControl({
        value:
          this.getPreFill(data.selectedPolicy.archiveEmailsToBeNotified, this.multiEdit),
        disabled: true
      }),
      retrieveEmailNotification: new FormControl({
        value:
          this.getPreFill(data.selectedPolicy.retrieveEmailNotification, this.multiEdit),
        disabled: true
      }),
      retrieveEmailsToBeNotified: new FormControl({
        value: this.getPreFill(
          data.selectedPolicy.retrieveEmailsToBeNotified,
          this.multiEdit
        ),
        disabled: true
      })
    });
  }

  getPreFill(field: any, multi: boolean): any {
    return field != null && !multi ? field.toString() : null;
  }

  ngOnInit() {
    this.selectedGroups = this.data.selectedGroups;
  }

  controlClick(control: any) {
    control.disabled = false;
  }

  save() {
    //dont patch results that are NULL
    var result = this.form.value;
    for (let key in result) {
      if (result[key] === null) {
        delete result[key];
      }
    }
    this.dialogRef.close(result);
  }

  close() {
    this.dialogRef.close();
  }
}
