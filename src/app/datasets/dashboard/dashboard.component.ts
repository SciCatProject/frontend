import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, ActionsSubject } from "@ngrx/store";

import deepEqual from "deep-equal";

import { DatasetFilters } from "state-management/models";

import {
  fetchDatasetsAction,
  fetchFacetCountsAction,
  prefillBatchAction,
  prefillFiltersAction,
  addDatasetAction,
  fetchDatasetCompleteAction,
  fetchMetadataKeysAction,
  changePageAction,
  setSearchTermsAction,
  setTextFilterAction,
} from "state-management/actions/datasets.actions";

import {
  selectHasPrefilledFilters,
  selectCurrentDataset,
  selectSelectedDatasets,
  selectPagination,
  selectIsBatchNonEmpty,
} from "state-management/selectors/datasets.selectors";
import { distinctUntilChanged, filter, map, take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { AddDatasetDialogComponent } from "datasets/add-dataset-dialog/add-dataset-dialog.component";
import { combineLatest, Subscription, lastValueFrom } from "rxjs";
import {
  selectProfile,
  selectCurrentUser,
  selectColumns,
  selectIsLoggedIn,
  selectHasFetchedSettings,
} from "state-management/selectors/user.selectors";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { loadDefaultSettings } from "state-management/actions/user.actions";
import { AppConfigService } from "app-config.service";
import {IngestorCreationComponent} from "ingestor/ingestor-page/ingestor-creation.component";

@Component({
  selector: "dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"],
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private pagination$ = this.store.select(selectPagination);
  private readyToFetch$ = this.store
    .select(selectHasPrefilledFilters)
    .pipe(filter((has) => has));
  loggedIn$ = this.store.select(selectIsLoggedIn);
  selectedSets$ = this.store.select(selectSelectedDatasets);
  selectColumns$ = this.store.select(selectColumns);
  selectHasFetchedSettings$ = this.store.select(selectHasFetchedSettings);

  public nonEmpty$ = this.store.select(selectIsBatchNonEmpty);

  subscriptions: Subscription[] = [];

  appConfig = this.appConfigService.getConfig();

  currentUser: ReturnedUserDto;
  userGroups: string[] = [];
  clearColumnSearch = false;

  @ViewChild(MatSidenav, { static: false }) sideNav!: MatSidenav;
  @ViewChild('ingestor') ingestor: IngestorCreationComponent;

  constructor(
    public appConfigService: AppConfigService,
    private actionsSubj: ActionsSubject,
    public dialog: MatDialog,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onTextChange(term: string) {
    this.store.dispatch(setSearchTermsAction({ terms: term }));
    this.store.dispatch(setTextFilterAction({ text: term }));
  }

  onSearchAction() {
    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize }),
    );
  }

  onRowClick(dataset: OutputDatasetObsoleteDto): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }

  openDialog(): void {
    if (this.ingestor) {
      this.ingestor.onClickAddIngestion();
    }
  }

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());
    this.store.dispatch(fetchMetadataKeysAction());

    this.subscriptions.push(
      combineLatest([
        this.pagination$,
        this.readyToFetch$,
        this.loggedIn$,
        this.selectHasFetchedSettings$,
      ])
        .pipe(
          map(([pagination, , loggedIn, hasFetchedSettings]) => [
            pagination,
            loggedIn,
            hasFetchedSettings,
          ]),
          distinctUntilChanged(deepEqual),
        )
        .subscribe(async ([pagination, loggedIn]) => {
          const hasFetchedSettings = await lastValueFrom(
            this.selectHasFetchedSettings$.pipe(take(1)),
          );

          if (!hasFetchedSettings) {
            return;
          }

          this.store.dispatch(fetchDatasetsAction());
          this.store.dispatch(fetchFacetCountsAction());
          this.router.navigate(["/datasets"], {
            queryParams: { args: JSON.stringify(pagination) },
          });
          if (!loggedIn) {
            this.store.dispatch(
              loadDefaultSettings({ config: this.appConfig }),
            );
          }
        }),
    );

    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          map((params) => params.args as string),
          take(1),
          map((args) => (args ? (JSON.parse(args) as DatasetFilters) : {})),
        )
        .subscribe((filters) =>
          this.store.dispatch(prefillFiltersAction({ values: filters })),
        ),
    );

    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.currentUser = user;
        }
      }),
    );

    this.subscriptions.push(
      this.store.select(selectProfile).subscribe((profile) => {
        if (profile) {
          this.userGroups = profile.accessGroups;
        }
      }),
    );

    this.subscriptions.push(
      this.actionsSubj.subscribe((data) => {
        if (data.type === fetchDatasetCompleteAction.type) {
          this.store
            .select(selectCurrentDataset)
            .subscribe((dataset) => {
              if (dataset) {
                const pid = encodeURIComponent(dataset.pid);
                this.router.navigateByUrl("/datasets/" + pid);
              }
            })
            .unsubscribe();
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
