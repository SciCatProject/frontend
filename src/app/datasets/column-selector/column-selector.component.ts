import { Component, OnInit, Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { getColumns } from "state-management/selectors/users.selectors";
import { MatCheckboxChange } from "@angular/material";
import {
  SelectColumnAction,
  DeselectColumnAction
} from "state-management/actions/user.actions";
import { AppConfig, APP_CONFIG } from "app-config.module";

@Component({
  selector: "column-selector",
  templateUrl: "./column-selector.component.html",
  styleUrls: ["./column-selector.component.scss"]
})
export class ColumnSelectorComponent implements OnInit {
  public columns = [
    "datasetName",
    "sourceFolder",
    "size",
    "creationTime",
    "type",
    "image",
    "metadata",
    "proposalId",
    "ownerGroup",
    "archiveStatus",
    "retrieveStatus",
    "dataStatus"
  ];
  // columns$ = this.store.pipe(select(getColumns));

  isSelected(column: string): boolean {
    // console.log(column);
    return true;
  }

  onSelect(event: MatCheckboxChange, column: string): void {
    if (event.checked) {
      console.log("checked ", column);
      this.store.dispatch(new SelectColumnAction(column));
    } else {
      console.log("unchecked ", column);
      this.store.dispatch(new DeselectColumnAction(column));
    }
  }

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {}
}
