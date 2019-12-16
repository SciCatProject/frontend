import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-add-dataset-dialog",
  templateUrl: "./add-dataset-dialog.component.html",
  styleUrls: ["./add-dataset-dialog.component.scss"]
})
export class AddDatasetDialogComponent {
  dataset: FormGroup;
  datasetName = new FormControl("", []);
  description = new FormControl("", []);
  ownerGroup = new FormControl("", [Validators.required]);
  sourceFolder = new FormControl("/nfs/", [
    Validators.required,
    Validators.minLength(5)
  ]);
  usedSoftware = new FormControl("", [
    Validators.required,
    Validators.minLength(2)
  ]);

  onSave(): void {
    this.dialogRef.close(this.dataset.value);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  constructor(
    public dialogRef: MatDialogRef<AddDatasetDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { userGroups: string[] }
  ) {
    this.dataset = this.fb.group({
      datasetName: this.datasetName,
      description: this.description,
      ownerGroup: this.ownerGroup,
      sourceFolder: this.sourceFolder,
      usedSoftware: this.usedSoftware
    });
  }
}
