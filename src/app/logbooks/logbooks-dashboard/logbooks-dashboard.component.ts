import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Dataset, Logbook } from "shared/sdk";
import { combineLatest, Subscription } from "rxjs";
import {
  selectCurrentLogbook,
  selectFilters,
  selectHasPrefilledFilters,
  selectEntriesCount,
  selectEntriesPerPage,
  selectPage,
} from "state-management/selectors/logbooks.selectors";
import {
  fetchLogbookAction,
  prefillFiltersAction,
  setTextFilterAction,
  setDisplayFiltersAction,
  changePageAction,
  sortByColumnAction,
} from "state-management/actions/logbooks.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { LogbookFilters } from "state-management/models";

import { map, take, filter, distinctUntilChanged } from "rxjs/operators";
import deepEqual from "deep-equal";
import {
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { AppConfigService } from "app-config.service";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import { OwnershipService } from "shared/services/ownership.service";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"],
})
export class LogbooksDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  entriesCount$ = this.store.select(selectEntriesCount);
  entriesPerPage$ = this.store.select(selectEntriesPerPage);
  currentPage$ = this.store.select(selectPage);
  filters$ = this.store.select(selectFilters);
  dataset: Dataset | undefined = undefined;
  readyToFetch$ = this.store
    .select(selectHasPrefilledFilters)
    .pipe(filter((has) => has));

  appConfig = this.appConfigService.getConfig();

  logbook: Logbook = new Logbook();
  filters: LogbookFilters = {
    textSearch: "",
    showBotMessages: true,
    showImages: true,
    showUserMessages: true,
    sortField: "timestamp:desc",
    skip: 0,
    limit: 25,
  };

  subscriptions: Subscription[] = [];

  constructor(
    public appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private ownershipService: OwnershipService
  ) {}

  applyRouterState(name: string, filters: LogbookFilters) {
    if (this.route.snapshot.url[0].path === "logbooks") {
      this.router.navigate(["/logbooks", name], {
        queryParams: { args: JSON.stringify(filters) },
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
    this.store.dispatch(fetchLogbookAction({ name: this.logbook.name }));
  }

  onSortChange(event: SortChangeEvent) {
    const { active: column, direction } = event;
    this.store.dispatch(sortByColumnAction({ column, direction }));
    this.store.dispatch(fetchLogbookAction({ name: this.logbook.name }));
  }

  reverseTimeline(): void {
    this.logbook.messages.reverse();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(selectCurrentLogbook).subscribe((logbook) => {
        if (logbook) {
          this.logbook = logbook;
        }
      })
    );
    this.subscriptions.push(
      this.store.select(selectCurrentDataset).subscribe((dataset) => {
        if (dataset) {
          this.dataset = dataset;
          if(dataset) {
            this.ownershipService.checkPermission(dataset, this.store, this.router);
          }
        }
      })
    );
    this.subscriptions.push(
      this.filters$.subscribe((filters) => {
        if (filters) {
          this.filters = filters;
        }
      })
    );

    this.subscriptions.push(
      combineLatest([this.route.params, this.filters$, this.readyToFetch$])
        .pipe(
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
          map((params) => params.args as string),
          take(1),
          map((args) => (args ? (JSON.parse(args) as LogbookFilters) : {}))
        )
        .subscribe((filters) =>
          this.store.dispatch(prefillFiltersAction({ values: filters }))
        )
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
