import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Dataset } from "shared/sdk/models";
import { UserApi } from "shared/sdk";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import {
  selectIsAdmin,
  selectIsLoading,
  selectIsLoggedIn,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { ActivatedRoute, IsActiveMatchOptions } from "@angular/router";
import { Subscription, Observable, combineLatest } from "rxjs";
import { map, pluck } from "rxjs/operators";
import {
  clearCurrentDatasetStateAction,
  fetchAttachmentsAction,
  fetchDatablocksAction,
  fetchDatasetAction,
  fetchOrigDatablocksAction,
  fetchRelatedDatasetsAction,
} from "state-management/actions/datasets.actions";
import {
  clearLogbookAction,
  fetchDatasetLogbookAction,
} from "state-management/actions/logbooks.actions";
import {
  clearCurrentProposalStateAction,
  fetchProposalAction,
} from "state-management/actions/proposals.actions";
import {
  clearCurrentSampleStateAction,
  fetchSampleAction,
} from "state-management/actions/samples.actions";
import { MatDialog } from "@angular/material/dialog";
import { AppConfigService } from "app-config.service";
import { fetchInstrumentAction } from "state-management/actions/instruments.actions";

export interface JWT {
  jwt: string;
}

export interface FileObject {
  pid: string;
  files: string[];
}
enum TAB {
  details = "Details",
  jsonScientificMetadata = "Scientific Metadata (JSON)",
  datafiles = "Datafiles",
  relatedDatasets = "Related Datasets",
  reduce = "Reduce",
  logbook = "Logbook",
  attachments = "Attachments",
  admin = "Admin",
  lifecycle = "Lifecycle",
}
@Component({
  selector: "dataset-details-dashboard",
  templateUrl: "./dataset-details-dashboard.component.html",
  styleUrls: ["./dataset-details-dashboard.component.scss"],
})
export class DatasetDetailsDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private subscriptions: Subscription[] = [];
  loading$ = this.store.select(selectIsLoading);
  loggedIn$ = this.store.select(selectIsLoggedIn);
  dataset$ = this.store.select(selectCurrentDataset);
  jwt$: Observable<JWT> = new Observable<JWT>();
  appConfig = this.appConfigService.getConfig();

  dataset: Dataset | undefined;
  navLinks: {
    location: string;
    label: string;
    icon: string;
    enabled: boolean;
  }[] = [];

  routerLinkActiveOptions: IsActiveMatchOptions = {
    matrixParams: "ignored",
    queryParams: "ignored",
    fragment: "ignored",
    paths: "exact",
  };

  fetchDataActions: { [tab: string]: { action: any; loaded: boolean } } = {
    [TAB.details]: { action: fetchDatasetAction, loaded: false },
    [TAB.jsonScientificMetadata]: { action: fetchDatasetAction, loaded: false },
    [TAB.relatedDatasets]: {
      action: fetchRelatedDatasetsAction,
      loaded: false,
    },
    [TAB.datafiles]: { action: fetchOrigDatablocksAction, loaded: false },
    [TAB.logbook]: { action: fetchDatasetLogbookAction, loaded: false },
    [TAB.attachments]: { action: fetchAttachmentsAction, loaded: false },
    [TAB.admin]: { action: fetchDatablocksAction, loaded: false },
  };
  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : [])),
  );

  constructor(
    public appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private store: Store,
    private userApi: UserApi,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.pipe(pluck("id")).subscribe((id: string) => {
        if (id) {
          this.resetTabs();
          // Fetch dataset details
          this.store.dispatch(fetchDatasetAction({ pid: id }));
          this.fetchDataActions[TAB.details].loaded = true;
        }
      }),
    );

    const datasetSub = this.dataset$.subscribe((dataset) => {
      // Only run this code when dataset.pid is different from this.dataset.pid or this.dataset = null
      if (
        dataset &&
        (!this.dataset || (this.dataset && dataset.pid != this.dataset.pid))
      ) {
        this.dataset = dataset;
        combineLatest([this.accessGroups$, this.isAdmin$, this.loggedIn$])
          .subscribe(([groups, isAdmin, isLoggedIn]) => {
            const isInOwnerGroup =
              groups.indexOf(this.dataset.ownerGroup) !== -1 || isAdmin;
            const hasAccessToLogbook =
              isInOwnerGroup ||
              this.dataset.accessGroups.some((g) => groups.includes(g));
            this.navLinks = [
              {
                location: "./",
                label: TAB.details,
                icon: "menu",
                enabled: true,
              },
              {
                location: "./jsonScientificMetadata",
                label: TAB.jsonScientificMetadata,
                icon: "schema",
                enabled:
                  this.appConfig.datasetJsonScientificMetadata && isLoggedIn,
              },
              {
                location: "./datafiles",
                label: TAB.datafiles,
                icon: "cloud_download",
                enabled: true,
              },
              {
                location: "./related-datasets",
                label: TAB.relatedDatasets,
                icon: "folder",
                enabled: true,
              },
              {
                location: "./reduce",
                label: TAB.reduce,
                icon: "tune",
                enabled:
                  this.appConfig.datasetReduceEnabled &&
                  isLoggedIn &&
                  isInOwnerGroup,
              },
              {
                location: "./logbook",
                label: TAB.logbook,
                icon: "book",
                enabled:
                  this.appConfig.logbookEnabled &&
                  isLoggedIn &&
                  hasAccessToLogbook,
              },
              {
                location: "./attachments",
                label: TAB.attachments,
                icon: "insert_photo",
                enabled: isLoggedIn && isInOwnerGroup,
              },
              {
                location: "./lifecycle",
                label: TAB.lifecycle,
                icon: "loop",
                enabled: true,
              },
              {
                location: "./admin",
                label: TAB.admin,
                icon: "settings",
                enabled: isLoggedIn && isAdmin,
              },
            ];
          })
          .unsubscribe();
        // fetch data for the selected tab
        this.route.firstChild?.url
          .subscribe((childUrl) => {
            const tab = childUrl.length === 1 ? childUrl[0].path : "details";
            this.fetchDataForTab(TAB[tab]);
          })
          .unsubscribe();

        this.fetchDatasetRelatedDocuments();
      }
    });
    this.subscriptions.push(datasetSub);
    this.jwt$ = this.userApi.jwt();
  }
  resetTabs() {
    Object.values(this.fetchDataActions).forEach((tab) => {
      tab.loaded = false;
    });
  }
  onTabSelected(tab: string) {
    this.fetchDataForTab(tab);
  }
  fetchDataForTab(tab: string) {
    if (tab in this.fetchDataActions) {
      const args: { [key: string]: any } = { pid: this.dataset?.pid };
      // load related data for selected tab
      switch (tab) {
        case TAB.details:
          {
            const { action, loaded } = this.fetchDataActions[TAB.attachments];
            if (!loaded) {
              this.store.dispatch(action(args));
              this.fetchDataActions[TAB.attachments].loaded = true;
            }
          }
          break;
        default: {
          const { action, loaded } = this.fetchDataActions[tab];
          if (!loaded) {
            this.fetchDataActions[tab].loaded = true;
            this.store.dispatch(action(args));
          }
        }
      }
    }
  }

  fetchDatasetRelatedDocuments(): void {
    if (this.dataset) {
      if ("proposalId" in this.dataset) {
        this.store.dispatch(
          fetchProposalAction({
            proposalId: this.dataset["proposalId"] as string,
          }),
        );
      } else {
        this.store.dispatch(clearLogbookAction());
      }
      if ("sampleId" in this.dataset) {
        this.store.dispatch(
          fetchSampleAction({ sampleId: this.dataset["sampleId"] as string }),
        );
      }
      if ("instrumentId" in this.dataset) {
        this.store.dispatch(
          fetchInstrumentAction({
            pid: this.dataset["instrumentId"] as string,
          }),
        );
      }
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.store.dispatch(clearCurrentDatasetStateAction());
    this.store.dispatch(clearCurrentProposalStateAction());
    this.store.dispatch(clearCurrentSampleStateAction());
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
