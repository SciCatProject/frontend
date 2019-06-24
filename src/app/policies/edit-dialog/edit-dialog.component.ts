import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatChipInputEvent
} from "@angular/material";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
  selector: "edit-dialog",
  templateUrl: "./edit-dialog.component.html",
  styleUrls: ["./edit-dialog.component.scss"]
})
export class EditDialogComponent implements /*OnChanges,*/ OnInit {
  data: any;
  multiEdit: boolean;
  selectedGroups: string[];
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data;
    this.multiEdit = data.multiSelect;
    // should make selected policy null is multi select, need to preserve group?
    if (this.multiEdit) {
      this.data.selectedPolicy.archiveEmailsToBeNotified = [];
      this.data.selectedPolicy.retrieveEmailsToBeNotified = [];
    }

    this.form = new FormGroup({
      autoArchive: new FormControl({
        value: this.getPreFill(data.selectedPolicy.autoArchive, this.multiEdit),
        disabled: true
        /*, Validators.required*/
      }),
      tapeRedundancy: new FormControl({
        value: this.getPreFill(
          data.selectedPolicy.tapeRedundancy,
          this.multiEdit
        ),
        disabled: true
      }),
      autoArchiveDelay: new FormControl({
        value: this.getPreFill(
          data.selectedPolicy.autoArchiveDelay,
          this.multiEdit
        ),
        disabled: true
      }),
      archiveEmailNotification: new FormControl({
        value: this.getPreFill(
          data.selectedPolicy.archiveEmailNotification,
          this.multiEdit
        ),
        disabled: true
      }),
      archiveEmailsToBeNotified: new FormControl({
        value: null,
        disabled: true
      }),
      retrieveEmailNotification: new FormControl({
        value: this.getPreFill(
          data.selectedPolicy.retrieveEmailNotification,
          this.multiEdit
        ),
        disabled: true
      }),
      retrieveEmailsToBeNotified: new FormControl({
        value: null, // value is not useable in chiplists
        disabled: true
      })
    });
  }

  getPreFill(field: any, multi: boolean): any {
    return field != null && !multi ? field.toString() : null;
  }

  getPreFillArray(field: any, multi: boolean): any {
    return field != null && !multi ? field : null;
  }

  addRetrieveEmails(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.data.selectedPolicy.retrieveEmailsToBeNotified.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  addArchiveEmails(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.data.selectedPolicy.archiveEmailsToBeNotified.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  removeRetrieveEmail(chip: any): void {
    const index = this.data.selectedPolicy.retrieveEmailsToBeNotified.indexOf(chip);

    if (index >= 0) {
      this.data.selectedPolicy.retrieveEmailsToBeNotified.splice(index, 1);
    }
  }

  removeArchiveEmail(chip: any): void {
    const index = this.data.selectedPolicy.archiveEmailsToBeNotified.indexOf(chip);

    if (index >= 0) {
      this.data.selectedPolicy.archiveEmailsToBeNotified.splice(index, 1);
    }
  }

  ngOnInit() {
    this.selectedGroups = this.data.selectedGroups;


  }

  controlClick(control: any) {
    this.form.controls[control.ngControl.name].enable();
  }

  save() {
    // dont patch results that are NULL
    // handle chip lists
    if (!this.multiEdit) {
      this.form.controls.archiveEmailsToBeNotified.setValue(
        this.data.selectedPolicy.archiveEmailsToBeNotified
      );
      this.form.controls.retrieveEmailsToBeNotified.setValue(
        this.data.selectedPolicy.retrieveEmailsToBeNotified
      );
    }
    const result = this.form.value;
    for (const key in result) {
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
