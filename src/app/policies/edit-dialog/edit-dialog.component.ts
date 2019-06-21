import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from "@angular/material";
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
      retrieveChipList: new FormControl({
        value: null,
        disabled: true
      }),
    });
  }

  getPreFill(field: any, multi: boolean): any {
    return field != null && !multi ? field.toString() : null;
  }

  getPreFillArray(field: any, multi: boolean): any {
    return field != null && !multi ? field : null;
  }


  /*addAuthor(event) {
    this.form.authors.push(event.value);
    event.input.value = "";
  }*/

  addRetrieveEmails(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    console.log("in val ", input, value)

    // Add our fruit
    if ((value || '').trim()) {
      this.data.selectedPolicy.retrieveEmailsToBeNotified.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.data.retrieveEmailsToBeNotified.indexOf(fruit);

    if (index >= 0) {
      this.data.retrieveEmailsToBeNotifiedsplice(index, 1);
    }
  }

  ngOnInit() {
    this.selectedGroups = this.data.selectedGroups;
  }

  controlClick(control: any) {
    console.log("control", control)
    control.disabled = false;
  }

  save() {
    // dont patch results that are NULL
    console.log("this.form.value", this.form.value)
    const result = this.form.value;
    for (let key in result) {
      if (result[key] === null) {
        delete result[key];
      }
    }
    if (result.retrieveEmailsToBeNotified === "") {
      result.retrieveEmailsToBeNotified = [];
    }
    if (result.archiveEmailsToBeNotified === "") {
      result.archiveEmailsToBeNotified = [];
    }
    this.dialogRef.close(result);
  }

  close() {
    this.dialogRef.close();
  }
}
