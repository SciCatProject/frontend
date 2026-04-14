import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DynamicField {
  label: string;
  type: "text" | "textarea" | "select";
  required: boolean;
  options?: { label: string; value: string }[];
}

export interface DynamicDialogData {
  title: string;
  question?: string;
  choice?: {
    options: Array<{ option: string }>;
  };
  additionalFields?: { [key: string]: DynamicField };
  [key: string]: any;
}

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
  standalone: false,
})
export class DialogComponent {
  form: FormGroup = new FormGroup({});
  fieldKeys: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DynamicDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
