import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-add-dataset-dialog",
  templateUrl: "./add-dataset-dialog.component.html",
  styleUrls: ["./add-dataset-dialog.component.scss"],
})
export class AddDatasetDialogComponent {
  form: FormGroup;
  datasetName = new FormControl("", []);
  description = new FormControl("", []);
  ownerGroup = new FormControl("", [Validators.required]);
  sourceFolder = new FormControl("/nfs/", [
    Validators.required,
    Validators.minLength(5),
  ]);
  usedSoftware = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userGroups: string[] },
    public dialogRef: MatDialogRef<AddDatasetDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      datasetName: this.datasetName,
      description: this.description,
      ownerGroup: this.ownerGroup,
      sourceFolder: this.sourceFolder,
      usedSoftware: this.usedSoftware,
    });
  }

  onSave(): void {
    this.dialogRef.close(this.form.value);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
