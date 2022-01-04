import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Store } from "@ngrx/store";
import {
  Dataset,
  UserApi,
} from "shared/sdk";
import {
  getCurrentDataset,
  getPublicViewMode,
} from "state-management/selectors/datasets.selectors";
import {
  getIsAdmin,
  getIsLoading,
  getIsLoggedIn,
  getProfile,
} from "state-management/selectors/user.selectors";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable, combineLatest } from "rxjs";
import { map, pluck } from "rxjs/operators";
import { APP_CONFIG, AppConfig } from "app-config.module";
import {
  fetchDatasetAction,
} from "state-management/actions/datasets.actions";
import {
  clearLogbookAction,
  fetchLogbookAction,
} from "state-management/actions/logbooks.actions";
import { fetchProposalAction } from "state-management/actions/proposals.actions";
import { fetchSampleAction } from "state-management/actions/samples.actions";
import { MatDialog } from "@angular/material/dialog";

export interface JWT {
  jwt: string;
}

export interface FileObject {
  pid: string;
  files: string[];
}

@Component({
  selector: "dataset-details-dashboard",
  templateUrl: "./dataset-details-dashboard.component.html",
  styleUrls: ["./dataset-details-dashboard.component.scss"],
})
export class DatasetDetailsDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  private subscriptions: Subscription[] = [];
  loading$ = this.store.select((getIsLoading));
  loggedIn$ = this.store.select((getIsLoggedIn));
  jwt$: Observable<JWT> = new Observable<JWT>();
  dataset: Dataset | undefined;
  navLinks :{
    location: string;
    label: string;
    icon: string;
    enabled: boolean;
  }[] = [];
  userProfile$ = this.store.select((getProfile));
  isAdmin$ = this.store.select((getIsAdmin));
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : []))
  );

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private store: Store<Dataset>,
    private userApi: UserApi,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.pipe(pluck("id")).subscribe((id: string) => {
        if (id) {
          console.log({ id });
          this.store
            .select((getPublicViewMode))
            .subscribe((viewPublic) => {
              if (viewPublic) {
                this.store.dispatch(
                  fetchDatasetAction({
                    pid: id,
                    filters: { isPublished: viewPublic },
                  })
                );
              } else {
                this.store.dispatch(fetchDatasetAction({ pid: id }));
              }
            })
            .unsubscribe();
        }
      })
    );

    this.subscriptions.push(
      this.store.select((getCurrentDataset)).subscribe((dataset) => {
        if (dataset) {
          this.dataset = dataset;
          this.subscriptions.push(
            combineLatest([this.accessGroups$, this.isAdmin$, this.loggedIn$]).subscribe(
              ([groups, isAdmin, isLoggedIn]) => {
                const isInOwnerGroup = groups.indexOf(this.dataset.ownerGroup) !== -1 || isAdmin;
                this.navLinks = [
                  { location: "./", label: "Details", icon: "menu", enabled: true },
                  { location: "./datafiles", label: "Datafiles", icon: "cloud_download", enabled: true },
                  { location: "./reduce", label: "Reduce", icon: "tune", enabled: this.appConfig.datasetReduceEnabled && isLoggedIn && isInOwnerGroup},
                  { location: "./logbook", label: "Logbook", icon: "book", enabled: this.appConfig.logbookEnabled && isLoggedIn && isInOwnerGroup},
                  { location: "./attachments", label: "Attachments", icon: "insert_photo", enabled: isLoggedIn && isInOwnerGroup},
                  { location: "./lifecycle", label: "Lifecycle", icon: "loop", enabled: true},
                  { location: "./admin", label: "Admin", icon: "settings", enabled: isLoggedIn && isAdmin}
                ];
              }
            ));

          if ("proposalId" in dataset) {
            this.store.dispatch(
              fetchProposalAction({ proposalId: dataset["proposalId"] })
            );
            this.store.dispatch(
              fetchLogbookAction({ name: dataset["proposalId"] })
            );
          } else {
            this.store.dispatch(clearLogbookAction());
          }
          if ("sampleId" in dataset) {
            this.store.dispatch(
              fetchSampleAction({ sampleId: dataset["sampleId"] })
            );
          }
        }
      })
    );
    this.jwt$ = this.userApi.jwt();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
