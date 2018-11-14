import { Inject, Component } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "scientific-condition-dialog",
  templateUrl: "scientific-condition-dialog.component.html"
})
export class ScientificConditionDialogComponent {
  public lhs: string = "";
  public rhs: string = "";
  public relation: string = "EQUAL_TO_NUMERIC";

  constructor(
    public dialogRef: MatDialogRef<ScientificConditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) {}

  add() {
    const { lhs, relation } = this;
    const rawRhs = this.rhs;
    const rhs = relation === "EQUAL_TO_STRING" ? rawRhs : Number(rawRhs);
    this.dialogRef.close({ data: { lhs, rhs, relation }});
  }

  invalid() {
    if (this.relation !== "EQUAL_TO_STRING" && isNaN(Number(this.rhs))) {
      return true;
    }

    return this.lhs.length * this.rhs.length === 0;
  }
}
