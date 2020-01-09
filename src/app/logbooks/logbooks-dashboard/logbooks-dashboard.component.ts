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
  getFilters,
  getHasPrefilledFilters,
  getEntriesCount,
  getEntriesPerPage,
  getPage
} from "state-management/selectors/logbooks.selectors";
import {
  fetchLogbookAction,
  prefillFiltersAction,
  setTextFilterAction,
  setDisplayFiltersAction,
  changePageAction
} from "state-management/actions/logbooks.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { LogbookFilters } from "state-management/models";
import * as rison from "rison";
import {
  map,
  take,
  filter,
  combineLatest,
  distinctUntilChanged
} from "rxjs/operators";
import * as deepEqual from "deep-equal";
import { PageChangeEvent } from "shared/modules/table/table.component";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"]
})
export class LogbooksDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  entriesCount$ = this.store.pipe(select(getEntriesCount));
  entriesPerPage$ = this.store.pipe(select(getEntriesPerPage));
  currentPage$ = this.store.pipe(select(getPage));
  filters$ = this.store.pipe(select(getFilters));
  readyToFetch$ = this.store.pipe(
    select(getHasPrefilledFilters),
    filter(has => has)
  );

  logbook: Logbook;

  subscriptions: Subscription[] = [];

  applyRouterState(name: string, filters: LogbookFilters) {
    if (this.route.snapshot.url[0].path === "logbooks") {
      this.router.navigate(["/logbooks", name], {
        queryParams: { args: rison.encode(filters) }
      });
    }
  }

  onTextSearchChange(query: string) {
    this.store.dispatch(setTextFilterAction({ textSearch: query }));
    this.store.dispatch(fetchLogbookAction({ name: this.logbook.name }));
  }

  onFilterSelect(filters: LogbookFilters) {
    const { showBotMessages, showImages, showUserMessages } = filters;
    this.store.dispatch(
      setDisplayFiltersAction({ showBotMessages, showImages, showUserMessages })
    );
    this.store.dispatch(fetchLogbookAction({ name: this.logbook.name }));
    this.applyRouterState(this.logbook.name, filters);
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
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
      this.route.params
        .pipe(
          combineLatest(this.filters$, this.readyToFetch$),
          map(([params, filters, _]) => [params, filters]),
          distinctUntilChanged(deepEqual)
        )
        .subscribe(([{ name }, filters]) => {
          if (name) {
            this.store.dispatch(fetchLogbookAction({ name }));
            this.applyRouterState(name, filters as LogbookFilters);
          }
        })
    );

    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          map(params => params.args as string),
          take(1),
          map(args => (args ? rison.decode<LogbookFilters>(args) : {}))
        )
        .subscribe(filters =>
          this.store.dispatch(prefillFiltersAction({ values: filters }))
        )
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
