import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";

import { fetchLogbooksAction } from "state-management/actions/logbooks.actions";
import { getLogbooks } from "state-management/selectors/logbooks.selectors";
import { Logbook } from "state-management/models";

@Component({
  selector: "app-logbooks-table",
  templateUrl: "./logbooks-table.component.html",
  styleUrls: ["./logbooks-table.component.scss"]
})
export class LogbooksTableComponent implements OnInit {
  logbooks$ = this.store.pipe(select(getLogbooks));

  columnsToDisplay: string[] = ["name", "latestEntry", "sender", "entry"];

  onClick(logbook: Logbook): void {
    this.router.navigateByUrl("/logbooks/" + logbook.name);
  }

  constructor(private router: Router, private store: Store<Logbook>) {}

  ngOnInit() {
    this.store.dispatch(fetchLogbooksAction());
  }
}
