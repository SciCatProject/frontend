import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Logbook } from "@scicatproject/scicat-sdk-ts";

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

  onClick(logbook: Logbook): void {
    this.router.navigateByUrl("/logbooks/" + logbook.name);
  }

  ngOnInit() {
    this.store.dispatch(fetchLogbooksAction());
  }
}
