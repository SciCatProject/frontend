import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { APP_CONFIG, AppConfig } from "app-config.module";

import { FetchLogbooksAction } from "state-management/actions/logbooks.actions";
import { getLogbooks } from "state-management/selectors/logbooks.selector";
import { Logbook } from "state-management/models";

@Component({
  selector: "app-logbooks-table",
  templateUrl: "./logbooks-table.component.html",
  styleUrls: ["./logbooks-table.component.scss"]
})
export class LogbooksTableComponent implements OnInit {
  logbooks$: Observable<Logbook[]>;

  columnsToDisplay: string[] = ["name", "latestEntry", "sender", "entry"];

  constructor(
    private router: Router,
    private store: Store<Logbook[]>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.logbooks$ = store.pipe(select(getLogbooks));
  }

  ngOnInit() {
    this.store.dispatch(new FetchLogbooksAction());
  }

  onClick(logbook: Logbook): void {
    this.router.navigateByUrl("/logbooks/" + logbook.name);
  }
}
