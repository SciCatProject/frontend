import { Component, Inject, Type } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-ingestor-confirmation-dialog",
  templateUrl: "./ingestor.confirmation-dialog.html",
  styleUrls: ["../../ingestor.component.scss"],
})
export class IngestorConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<IngestorConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  get message(): string {
    return this.data.message || "Are you sure?";
  }

  get header(): string {
    return this.data.header || "Confirmation";
  }

  get messageComponent(): Type<any> | null {
    return this.data.messageComponent || null;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
