import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { select, Store } from "@ngrx/store";

import * as rison from "rison";
import * as deepEqual from "deep-equal";

import { DatasetFilters, User } from "state-management/models";

import {
  fetchDatasetsAction,
  fetchFacetCountsAction,
  prefillBatchAction,
  prefillFiltersAction,
  addDatasetAction
} from "state-management/actions/datasets.actions";

import {
  getFilters,
  getHasPrefilledFilters,
  getDatasetsInBatch
} from "state-management/selectors/datasets.selectors";
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  take
} from "rxjs/operators";
import { MatDialog } from "@angular/material";
import { AddDatasetDialogComponent } from "datasets/add-dataset-dialog/add-dataset-dialog.component";
import { Subscription } from "rxjs";
import {
  getProfile,
  getCurrentUser
} from "state-management/selectors/user.selectors";
import { DerivedDatasetInterface, DerivedDataset } from "shared/sdk";

@Component({
  selector: "dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
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

  openDialog(): void {
    const { username, email } = this.currentUser;
    const datasetInterface: DerivedDatasetInterface = {
      accessGroups: [],
      contactEmail: email,
      createdBy: username,
      creationTime: new Date(),
      isPublished: false,
      keywords: [],
      owner: username.replace("ldap.", ""),
      ownerEmail: email,
      ownerGroup: "",
      packedSize: 0,
      inputDatasets: [],
      investigator: email,
      scientificMetadata: {},
      size: 0,
      sourceFolder: "/nfs/",
      type: "derived",
      usedSoftware: []
    };
    const dialogRef = this.dialog.open(AddDatasetDialogComponent, {
      width: "500px",
      data: { dataset: datasetInterface, userGroups: this.userGroups }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataset = new DerivedDataset(
          res.dataset as DerivedDatasetInterface
        );
        console.log("dataset", dataset);
        // this.store.dispatch(addDatasetAction({ dataset }));
      }
    });
  }

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public dialog: MatDialog,
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());

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
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
