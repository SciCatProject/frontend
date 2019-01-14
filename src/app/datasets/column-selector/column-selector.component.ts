import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { getColumns } from "state-management/selectors/users.selectors";

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
    "retrieveStatus"
  ];
  columns$ = this.store.pipe(select(getColumns));

  constructor(private store: Store<any>) {}

  ngOnInit() {}
}
