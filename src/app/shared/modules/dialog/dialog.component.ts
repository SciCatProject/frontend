import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogOptionData {
  option: string;
  tooltip?: string;
}

export interface DynamicField {
  label: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  options?: DialogOptionData[];
}

export interface DynamicDialogData {
  title: string;
  label?: string;
  question?: string;
  choice?: {
    options: DialogOptionData[];
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
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DynamicDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
