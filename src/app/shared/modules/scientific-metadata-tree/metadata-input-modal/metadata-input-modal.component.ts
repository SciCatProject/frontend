import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MetadataInputBase } from "../base-classes/metadata-input-base";

export interface InputObject{
  parent: string;
  type: string;
  child: string;
  value: any;
  unit?: string;
}

@Component({
  selector: "metadata-input-modal",
  templateUrl: "./metadata-input-modal.component.html",
  styleUrls: ["./metadata-input-modal.component.scss"]
})

export class MetadataInputModalComponent extends MetadataInputBase implements OnInit  {
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<MetadataInputModalComponent>) {
    super();
   }
  ngOnInit(): void {
    this.metadataForm = this.initilizeFormControl();
  }

  initilizeFormControl() {
    const field = this.formBuilder.group({
      parent: new FormControl("", [
        Validators.required,
        Validators.minLength(2)
      ]),
      type: new FormControl("", [Validators.required]),
      child: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      value: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      unit: new FormControl("", [
        Validators.required,
        this.unitValidator(),
      ]),
    });
    return field;
  }

  onSave(): void {
    this.dialogRef.close(this.metadataForm.value);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
