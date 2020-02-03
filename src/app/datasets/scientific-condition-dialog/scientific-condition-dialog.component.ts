import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Store, select } from "@ngrx/store";
import { Dataset } from "shared/sdk";
import { fetchMetadataKeysAction } from "state-management/actions/datasets.actions";
import { getMetadataKeys } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "scientific-condition-dialog",
  templateUrl: "scientific-condition-dialog.component.html"
})
export class ScientificConditionDialogComponent {
  metadataKeys$ = this.store.pipe(select(getMetadataKeys));
  public lhs = "";
  public rhs = "";
  public relation = "GREATER_THAN";

  onChange(metadataKey: string) {
    this.store.dispatch(fetchMetadataKeysAction({ metadataKey }));
  }

  add() {
    const { lhs, relation } = this;
    const rawRhs = this.rhs;
    const rhs = relation === "EQUAL_TO_STRING" ? rawRhs : Number(rawRhs);
    this.dialogRef.close({ data: { lhs, rhs, relation } });
  }

  cancel() {
    this.dialogRef.close();
  }

  isInvalid() {
    if (this.relation !== "EQUAL_TO_STRING" && isNaN(Number(this.rhs))) {
      return true;
    } else {
      return this.lhs.length * this.rhs.length === 0;
    }
  }

  constructor(
    public dialogRef: MatDialogRef<ScientificConditionDialogComponent>,
    private store: Store<Dataset>
  ) {}
}
