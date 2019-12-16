import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DerivedDatasetInterface } from "shared/sdk";

interface DialogData {
  dataset: DerivedDatasetInterface;
  userGroups: string[];
}

@Component({
  selector: "app-add-dataset-dialog",
  templateUrl: "./add-dataset-dialog.component.html",
  styleUrls: ["./add-dataset-dialog.component.scss"]
})
export class AddDatasetDialogComponent {
  onClose(): void {
    this.dialogRef.close();
  }

  constructor(
    public dialogRef: MatDialogRef<AddDatasetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
