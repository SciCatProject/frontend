import { Component, OnDestroy, OnInit, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { select, Store, ActionsSubject } from "@ngrx/store";

import * as rison from "rison";
import * as deepEqual from "deep-equal";

import { DatasetFilters, User, TableColumn } from "state-management/models";

import {
  fetchDatasetsAction,
  fetchFacetCountsAction,
  prefillBatchAction,
  prefillFiltersAction,
  addDatasetAction,
  fetchDatasetCompleteAction,
  fetchMetadataKeysAction
} from "state-management/actions/datasets.actions";

import {
  getFilters,
  getHasPrefilledFilters,
  getDatasetsInBatch,
  getCurrentDataset,
  getSelectedDatasets
} from "state-management/selectors/datasets.selectors";
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  take
} from "rxjs/operators";
import { MatDialog, MatSidenav } from "@angular/material";
import { AddDatasetDialogComponent } from "datasets/add-dataset-dialog/add-dataset-dialog.component";
import { Subscription } from "rxjs";
import {
  getProfile,
  getCurrentUser,
  getColumns
} from "state-management/selectors/user.selectors";
import { DerivedDataset } from "shared/sdk";
import {
  selectColumnAction,
  deselectColumnAction
} from "state-management/actions/user.actions";
import { SelectColumnEvent } from "datasets/dataset-table-settings/dataset-table-settings.component";

@Component({
  selector: "dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedSets$ = this.store.pipe(select(getSelectedDatasets));
  private filters$ = this.store.pipe(select(getFilters));
  private readyToFetch$ = this.store.pipe(
    select(getHasPrefilledFilters),
    filter(has => has)
  );
  public nonEmpty$ = this.store.pipe(
    select(getDatasetsInBatch),
    map(batch => batch.length > 0)
  );

  subscriptions: Subscription[] = [];

  currentUser: User;
  userGroups: string[];

  displayedColumns: string[];
  tableColumns: TableColumn[];

  @ViewChild(MatSidenav, { static: false }) sideNav: MatSidenav;

  onSettingsClick(): void {
    this.sideNav.toggle();
  }

  onCloseClick(): void {
    this.sideNav.close();
  }

  onSelectColumn(event: SelectColumnEvent): void {
    const { checkBoxChange, column } = event;
    if (checkBoxChange.checked) {
      this.store.dispatch(selectColumnAction({ column }));
    } else if (!checkBoxChange.checked) {
      this.store.dispatch(deselectColumnAction({ column }));
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDatasetDialogComponent, {
      width: "500px",
      data: { userGroups: this.userGroups }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const { username, email } = this.currentUser;
        const dataset = new DerivedDataset({
          accessGroups: [],
          contactEmail: email, // Required
          createdBy: username,
          creationTime: new Date(), // Required
          datasetName: res.datasetName,
          description: res.description,
          inputDatasets: [], // Required
          investigator: email, // Required
          isPublished: false,
          keywords: [],
          owner: username.replace("ldap.", ""), // Required
          ownerEmail: email,
          ownerGroup: res.ownerGroup, // Required
          packedSize: 0,
          scientificMetadata: {},
          size: 0,
          sourceFolder: res.sourceFolder, // Required
          type: "derived", // Required
          usedSoftware: res.usedSoftware
            .split(",")
            .map((entry: string) => entry.trim())
            .filter((entry: string) => entry !== "") // Required
        });
        this.store.dispatch(addDatasetAction({ dataset }));
      }
    });
  }

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private actionsSubj: ActionsSubject,
    public dialog: MatDialog,
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());
    this.store.dispatch(fetchMetadataKeysAction({ metadataKey: "" }));

    this.subscriptions.push(
      this.filters$
        .pipe(
          combineLatest(this.readyToFetch$),
          map(([filters, _]) => filters),
          distinctUntilChanged(deepEqual)
        )
        .subscribe(filters => {
          this.store.dispatch(fetchDatasetsAction());
          this.store.dispatch(fetchFacetCountsAction());
          this.router.navigate(["/datasets"], {
            queryParams: { args: rison.encode(filters) }
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

    this.subscriptions.push(
      this.store.pipe(select(getCurrentUser)).subscribe(user => {
        this.currentUser = user;
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getProfile)).subscribe(profile => {
        if (profile) {
          this.userGroups = profile.accessGroups;
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getColumns)).subscribe(tableColumns => {
        this.displayedColumns = tableColumns
          .filter(column => column.enabled)
          .map(column => column.name);

        this.tableColumns = tableColumns.filter(
          column => column.name !== "select"
        );
      })
    );

    this.subscriptions.push(
      this.actionsSubj.subscribe(data => {
        if (data.type === fetchDatasetCompleteAction.type) {
          this.store
            .pipe(select(getCurrentDataset))
            .subscribe(dataset => {
              const pid = encodeURIComponent(dataset.pid);
              this.router.navigateByUrl("/datasets/" + pid);
            })
            .unsubscribe();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
