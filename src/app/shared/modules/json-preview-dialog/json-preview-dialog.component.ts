import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-json-preview-dialog",
  templateUrl: "./json-preview-dialog.component.html",
  styleUrls: ["./json-preview-dialog.component.scss"],
  standalone: false,
})
export class JsonPreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<JsonPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  close() {
    this.dialogRef.close();
  }
}
