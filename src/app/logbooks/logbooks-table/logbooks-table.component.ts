import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { fetchLogbooksAction } from "state-management/actions/logbooks.actions";
import { getLogbooks } from "state-management/selectors/logbooks.selectors";
import { Logbook } from "state-management/models";

@Component({
  selector: "app-logbooks-table",
  templateUrl: "./logbooks-table.component.html",
  styleUrls: ["./logbooks-table.component.scss"]
})
export class LogbooksTableComponent implements OnInit, OnDestroy {
  logbooks: Logbook[];
  logbooksSubscription: Subscription;

  columnsToDisplay: string[] = ["name", "latestEntry", "sender", "entry"];

  constructor(private router: Router, private store: Store<Logbook[]>) {}

  ngOnInit() {
    this.store.dispatch(fetchLogbooksAction());
    this.logbooksSubscription = this.store
      .pipe(select(getLogbooks))
      .subscribe(logbooks => {
        logbooks.forEach(logbook => {
          const reversedMessages = logbook.messages.reverse();
          logbook.messages = reversedMessages;
        });
        this.logbooks = logbooks;
      });
  }

  ngOnDestroy() {
    this.logbooksSubscription.unsubscribe();
  }

  onClick(logbook: Logbook): void {
    this.router.navigateByUrl("/logbooks/" + logbook.name);
  }
}
