import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
  AfterViewChecked
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  getCurrentLogbook,
  getFilters
} from "state-management/selectors/logbooks.selectors";
import {
  fetchLogbookAction,
  fetchFilteredEntriesAction,
  setFilterAction
} from "state-management/actions/logbooks.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { LogbookFilters } from "state-management/models";
import * as rison from "rison";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"]
})
export class LogbooksDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  logbook: Logbook;
  filters: LogbookFilters;

  subscriptions: Subscription[] = [];

  applyRouterState() {
    if (
      this.logbook &&
      this.filters &&
      this.route.snapshot.url[0].path === "logbooks"
    ) {
      this.router.navigate(["/logbooks", this.logbook.name], {
        queryParams: { args: rison.encode(this.filters) }
      });
    }
  }

  onTextSearchChange(query: string) {
    this.filters.textSearch = query;
    this.store.dispatch(setFilterAction({ filters: this.filters }));
    this.store.dispatch(
      fetchFilteredEntriesAction({
        name: this.logbook.name,
        filters: this.filters
      })
    );
    this.applyRouterState();
  }

  onFilterSelect(filters: LogbookFilters) {
    this.filters = filters;
    this.store.dispatch(setFilterAction({ filters: this.filters }));
    this.store.dispatch(
      fetchFilteredEntriesAction({
        name: this.logbook.name,
        filters: this.filters
      })
    );
    this.applyRouterState();
  }

  reverseTimeline(): void {
    this.logbook.messages.reverse();
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<Logbook>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getCurrentLogbook)).subscribe(logbook => {
        this.logbook = logbook;
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getFilters)).subscribe(filters => {
        this.filters = filters;
      })
    );

    this.subscriptions.push(
      this.route.params.subscribe(params => {
        if (params.hasOwnProperty("name")) {
          const name = params["name"];
          this.store.dispatch(fetchLogbookAction({ name }));
        }
      })
    );

    this.applyRouterState();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
