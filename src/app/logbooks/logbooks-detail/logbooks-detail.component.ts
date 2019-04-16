import { Component, OnInit, Inject, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { APP_CONFIG, AppConfig } from "app-config.module";

import { Dataset, Proposal } from "shared/sdk/models";
import { FetchLogbookAction } from "state-management/actions/logbooks.actions";
import { getLogbook } from "state-management/selectors/logbooks.selector";
import { Logbook } from "state-management/models";

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent implements OnInit, OnDestroy {
  logbook: Logbook;
  logbookSubscription: Subscription;
  displayedColumns: string[] = ["timestamp", "sender", "entry"];
  @Input() dataset: Dataset;
  @Input() proposal: Proposal;

  constructor(
    private route: ActivatedRoute,
    private store: Store<Logbook>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.logbookSubscription = store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });
  }

  ngOnInit() {
    this.getLogbook();
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
  }

  getLogbook(): void {
    let name = this.route.snapshot.paramMap.get("name");
    if (name === null) {
      name = "ERIC";
    }
    this.store.dispatch(new FetchLogbookAction(name));
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
}
