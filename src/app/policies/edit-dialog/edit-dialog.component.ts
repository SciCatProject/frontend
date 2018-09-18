import {
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from "@angular/forms";
import { Policy } from "state-management/models";

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
          data.selectedPolicy.autoArchive != null && !this.multiEdit
            ? data.selectedPolicy.autoArchive.toString()
            : null,
        disabled: true
        /*, Validators.required*/
      }),
      tapeRedundancy: new FormControl({
        value:
          data.selectedPolicy.tapeRedundancy  != null && !this.multiEdit
            ? data.selectedPolicy.tapeRedundancy.toString()
            : null,
        disabled: true
      }),
      autoArchiveDelay: new FormControl({
        value:
          data.selectedPolicy.autoArchiveDelay  != null && !this.multiEdit
            ? data.selectedPolicy.autoArchiveDelay.toString()
            : null,
        disabled: true
      }),
      archiveEmailNotification: new FormControl({
        value:
          data.selectedPolicy.archiveEmailNotification && !this.multiEdit
            ? data.selectedPolicy.archiveEmailNotification.toString()
            : null,
        disabled: true
      }),
      archiveEmailsToBeNotified: new FormControl({
        value:
          data.selectedPolicy.archiveEmailsToBeNotified  != null && !this.multiEdit
            ? data.selectedPolicy.archiveEmailsToBeNotified
            : null,
        disabled: true
      }),
      retrieveEmailNotification: new FormControl({
        value:
          data.selectedPolicy.retrieveEmailNotification  != null && !this.multiEdit
            ? data.selectedPolicy.retrieveEmailNotification.toString()
            : null,
        disabled: true
      }),
      retrieveEmailsToBeNotified: new FormControl({
        value:
          data.selectedPolicy.retrieveEmailsToBeNotified  != null && !this.multiEdit
            ? data.selectedPolicy.retrieveEmailsToBeNotified
            : null,
        disabled: true
      })
    });
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
