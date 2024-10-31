import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { fetchLogbooksAction } from "state-management/actions/logbooks.actions";
import { selectLogbooks } from "state-management/selectors/logbooks.selectors";

@Component({
  selector: "app-logbooks-table",
  templateUrl: "./logbooks-table.component.html",
  styleUrls: ["./logbooks-table.component.scss"],
})
export class LogbooksTableComponent implements OnInit {
  logbooks$ = this.store.select(selectLogbooks);

  columnsToDisplay: string[] = ["name", "latestEntry", "sender", "entry"];

  constructor(
    private router: Router,
    private store: Store,
  ) {}

  // TODO: Fix the type when the new sdk is generated with backend fix
  onClick(logbook: any): void {
    this.router.navigateByUrl("/logbooks/" + logbook.name);
  }

  ngOnInit() {
    this.store.dispatch(fetchLogbooksAction());
  }
}
