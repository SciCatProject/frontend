import { Inject, Component } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { Dataset } from "shared/sdk";
import { fetchMetadataKeysAction } from "state-management/actions/datasets.actions";

@Component({
  selector: "scientific-condition-dialog",
  templateUrl: "scientific-condition-dialog.component.html"
})
export class ScientificConditionDialogComponent {
  public lhs = "";
  public rhs = "";
  public relation = "EQUAL_TO_NUMERIC";

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
    @Inject(MAT_DIALOG_DATA)
    public data: { metadataKeys$: Observable<string[]> },
    private store: Store<Dataset>
  ) {
    this.store.dispatch(fetchMetadataKeysAction({ metadataKey: "" }));
  }
}
