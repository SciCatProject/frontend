import { Component, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectIsLoggedIn } from "state-management/selectors/user.selectors";
import * as fromActions from "state-management/actions/ingestor.actions";
import { IngestorHelper } from "./helper/ingestor.component-helper";
import { MatDialog } from "@angular/material/dialog";
import { IngestorCreationDialogBaseComponent } from "ingestor/ingestor-dialogs/creation-dialog/ingestor.creation-dialog-base.component";

@Component({
  selector: "ingestor-creation",
  styleUrls: ["./ingestor.component.scss"],
  templateUrl: "./ingestor-creation.component.html",
  standalone: false,
})
export class IngestorCreationComponent {
  sciCatLoggedIn$ = this.store.select(selectIsLoggedIn);
  readonly dialog = inject(MatDialog);

  constructor(private store: Store) {}

  onClickAddIngestion(): void {
    // Clean the current ingestion object
    const newTransferObject = IngestorHelper.createEmptyRequestInformation();
    newTransferObject.editorMode = "CREATION";

    this.store.dispatch(
      fromActions.resetIngestionObject({ ingestionObject: newTransferObject }),
    );

    this.dialog.closeAll();

    let dialogRef = null;
    dialogRef = this.dialog.open(IngestorCreationDialogBaseComponent, {
      disableClose: true,
      width: "75vw",
    });

    // Error if the dialog reference is not set
    if (dialogRef === null) return;
  }
}
