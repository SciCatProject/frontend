import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { getColumns } from "state-management/selectors/user.selectors";
import {
  map,
  filter,
  distinctUntilChanged,
  take
} from "rxjs/operators";
import {
  getFilters,
  getHasPrefilledFilters,
  getDatasets
} from "state-management/selectors/datasets.selectors";
import {
  fetchMetadataKeysAction,
  fetchFacetCountsAction,
  prefillFiltersAction,
  fetchDatasetsAction
} from "state-management/actions/datasets.actions";
import { combineLatest, Subscription } from "rxjs";

import * as deepEqual from "deep-equal";
import * as rison from "rison";
import { DatasetFilters, Dataset } from "state-management/models";
import { SelectColumnEvent } from "datasets/dataset-table-settings/dataset-table-settings.component";
import {
  selectColumnAction,
  deselectColumnAction
} from "state-management/actions/user.actions";
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: "anonymous-dashboard",
  templateUrl: "./anonymous-dashboard.component.html",
  styleUrls: ["./anonymous-dashboard.component.scss"]
})
export class AnonymousDashboardComponent implements OnInit, OnDestroy {
  private readyToFetch$ = this.store.pipe(
    select(getHasPrefilledFilters),
    filter(has => has)
  );
  datasets$ = this.store.pipe(select(getDatasets));
  tableColumns$ = this.store
    .pipe(select(getColumns))
    .pipe(map(columns => columns.filter(column => column.name !== "select")));
  filters$ = this.store.pipe(select(getFilters));

  clearColumnSearch = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatSidenav, { static: false }) sideNav: MatSidenav;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onSettingsClick(): void {
    this.sideNav.toggle();
    if (this.sideNav.opened) {
      this.clearColumnSearch = false;
    } else {
      this.clearColumnSearch = true;
    }
  }

  onCloseClick(): void {
    this.clearColumnSearch = true;
    this.sideNav.close();
  }

  onSelectColumn(event: SelectColumnEvent): void {
    const { checkBoxChange, column } = event;
    if (checkBoxChange.checked) {
      this.store.dispatch(
        selectColumnAction({ name: column.name, columnType: column.type })
      );
    } else if (!checkBoxChange.checked) {
      this.store.dispatch(
        deselectColumnAction({ name: column.name, columnType: column.type })
      );
    }
  }

  onRowClick(dataset: Dataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/anonymous/datasets/" + pid);
  }

  ngOnInit() {
    this.store.dispatch(fetchMetadataKeysAction());

    this.subscriptions.push(
      combineLatest([this.filters$, this.readyToFetch$])
        .pipe(
          map(([filters, _]) => filters),
          distinctUntilChanged(deepEqual)
        )
        .subscribe((filters) => {
          this.store.dispatch(fetchDatasetsAction());
          this.store.dispatch(fetchFacetCountsAction());
          this.router.navigate([""], {
            queryParams: { args: rison.encode(filters) },
          });
        })
    );

    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          map(params => params.args as string),
          take(1),
          map(args => (args ? rison.decode<DatasetFilters>(args) : {}))
        )
        .subscribe(filters =>
          this.store.dispatch(prefillFiltersAction({ values: filters }))
        )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
