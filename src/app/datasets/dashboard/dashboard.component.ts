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
} from "state-management/actions/datasets.actions";

import {
  selectHasPrefilledFilters,
  selectDatasetsInBatch,
  selectCurrentDataset,
  selectSelectedDatasets,
  selectPagination,
} from "state-management/selectors/datasets.selectors";
import { distinctUntilChanged, filter, map, take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { AddDatasetDialogComponent } from "datasets/add-dataset-dialog/add-dataset-dialog.component";
import { combineLatest, Subscription } from "rxjs";
import {
  selectProfile,
  selectCurrentUser,
  selectColumns,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import {
  selectColumnAction,
  deselectColumnAction,
  loadDefaultSettings,
} from "state-management/actions/user.actions";
import { SelectColumnEvent } from "datasets/dataset-table-settings/dataset-table-settings.component";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private pagination$ = this.store.select(selectPagination);
  private readyToFetch$ = this.store
    .select(selectHasPrefilledFilters)
    .pipe(filter((has) => has));
  loggedIn$ = this.store.select(selectIsLoggedIn);
  selectedSets$ = this.store.select(selectSelectedDatasets);
  selectColumns$ = this.store.select(selectColumns);

  tableColumns$ = combineLatest([this.selectColumns$, this.loggedIn$]).pipe(
    map(([columns, loggedIn]) =>
      columns.filter((column) => loggedIn || column.name !== "select"),
    ),
  );
  selectableColumns$ = this.selectColumns$.pipe(
    map((columns) => columns.filter((column) => column.name !== "select")),
  );
  public nonEmpty$ = this.store
    .select(selectDatasetsInBatch)
    .pipe(map((batch) => batch.length > 0));

  subscriptions: Subscription[] = [];

  appConfig = this.appConfigService.getConfig();

  currentUser: ReturnedUserDto;
  userGroups: string[] = [];
  clearColumnSearch = false;

  @ViewChild(MatSidenav, { static: false }) sideNav!: MatSidenav;

  constructor(
    public appConfigService: AppConfigService,
    private actionsSubj: ActionsSubject,
    public dialog: MatDialog,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize }),
    );
  }

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
        selectColumnAction({ name: column.name, columnType: column.type }),
      );
    } else if (!checkBoxChange.checked) {
      this.store.dispatch(
        deselectColumnAction({ name: column.name, columnType: column.type }),
      );
    }
  }

  onRowClick(dataset: OutputDatasetObsoleteDto): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDatasetDialogComponent, {
      width: "500px",
      data: { userGroups: this.userGroups },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const { username, email } = this.currentUser;
        const dataset = {
          accessGroups: [],
          contactEmail: email, // Required
          creationTime: new Date().toISOString(), // Required
          datasetName: res.datasetName,
          description: res.description,
          isPublished: false,
          keywords: [],
          owner: username.replace("ldap.", ""), // Required
          ownerEmail: email,
          ownerGroup: res.ownerGroup, // Required
          packedSize: 0,
          size: 0,
          sourceFolder: res.sourceFolder, // Required
          type: "derived", // Required
          inputDatasets: [], // Required
          investigator: email, // Required
          scientificMetadata: {},
          numberOfFilesArchived: 0, // Required
          principalInvestigator: undefined, // Required
          creationLocation: undefined, // Required
          usedSoftware: res.usedSoftware
            .split(",")
            .map((entry: string) => entry.trim())
            .filter((entry: string) => entry !== ""), // Required
        };
        this.store.dispatch(
          addDatasetAction({
            dataset: dataset,
          }),
        );
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());
    this.store.dispatch(fetchMetadataKeysAction());

    this.subscriptions.push(
      combineLatest([this.pagination$, this.readyToFetch$, this.loggedIn$])
        .pipe(
          map(([pagination, , loggedIn]) => [pagination, loggedIn]),
          distinctUntilChanged(deepEqual),
        )
        .subscribe(([pagination, loggedIn]) => {
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
