import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { Store } from "@ngrx/store";
import {
  selectCurrentDataset,
  selectIsCurrentDatasetInBatch,
} from "state-management/selectors/datasets.selectors";
import {
  selectIsAdmin,
  selectIsLoading,
  selectIsLoggedIn,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { ActivatedRoute, IsActiveMatchOptions } from "@angular/router";
import { Subscription, Observable, combineLatest } from "rxjs";
import { distinctUntilChanged, filter, map } from "rxjs/operators";
import * as fromDatasetActions from "state-management/actions/datasets.actions";
import {
  clearCurrentDatasetStateAction,
  fetchDatasetAction,
  fetchRelatedDatasetsAction,
} from "state-management/actions/datasets.actions";
import { clearLogbookAction } from "state-management/actions/logbooks.actions";
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
import {
  fetchInstrumentAction,
  clearCurrentInstrumentStateAction,
} from "state-management/actions/instruments.actions";
import { CurrentDataset } from "state-management/state/datasets.store";

export interface FileObject {
  pid: string;
  files: string[];
}

interface TabContext {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isInOwnerGroup: boolean;
  hasAccessToLogbook: boolean;
  isPublished: boolean;
  config: ReturnType<AppConfigService["getConfig"]>;
}

enum TAB {
  details = "Details",
  jsonScientificMetadata = "Scientific Metadata (JSON)",
  datafiles = "Datafiles",
  relatedDatasets = "Related Datasets",
  relationships = "Relationships",
  reduce = "Reduce",
  logbook = "Logbook",
  attachments = "Attachments",
  admin = "Admin",
  lifecycle = "Lifecycle",
}

const TAB_DEFINITIONS: {
  location: string;
  label: TAB;
  icon: string;
  isEnabled: (c: TabContext) => boolean;
}[] = [
  { location: "./", label: TAB.details, icon: "menu", isEnabled: () => true },
  {
    location: "./jsonScientificMetadata",
    label: TAB.jsonScientificMetadata,
    icon: "data_object",
    isEnabled: (c) => c.config.datasetJsonScientificMetadata && c.isLoggedIn,
  },
  {
    location: "./datafiles",
    label: TAB.datafiles,
    icon: "cloud_download",
    isEnabled: () => true,
  },
  {
    location: "./relatedDatasets",
    label: TAB.relatedDatasets,
    icon: "folder",
    isEnabled: () => true,
  },
  {
    location: "./reduce",
    label: TAB.reduce,
    icon: "tune",
    isEnabled: (c) =>
      c.config.datasetReduceEnabled && c.isLoggedIn && c.isInOwnerGroup,
  },
  {
    location: "./logbook",
    label: TAB.logbook,
    icon: "book",
    isEnabled: (c) =>
      c.config.logbookEnabled && c.isLoggedIn && c.hasAccessToLogbook,
  },
  {
    location: "./attachments",
    label: TAB.attachments,
    icon: "insert_photo",
    isEnabled: (c) => c.isInOwnerGroup || c.isPublished,
  },
  {
    location: "./lifecycle",
    label: TAB.lifecycle,
    icon: "loop",
    isEnabled: () => true,
  },
  {
    location: "./admin",
    label: TAB.admin,
    icon: "settings",
    isEnabled: (c) => c.isLoggedIn && c.isAdmin,
  },
];
@Component({
  selector: "dataset-details-dashboard",
  templateUrl: "./dataset-details-dashboard.component.html",
  styleUrls: ["./dataset-details-dashboard.component.scss"],
  standalone: false,
})
export class DatasetDetailsDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private subscriptions: Subscription[] = [];
  loading$ = this.store.select(selectIsLoading);
  loggedIn$ = this.store.select(selectIsLoggedIn);
  dataset$ = this.store.select(selectCurrentDataset);
  appConfig = this.appConfigService.getConfig();

  dataset: CurrentDataset | undefined;
  navLinks: {
    location: string;
    label: string;
    icon: string;
  }[] = [];

  routerLinkActiveOptions: IsActiveMatchOptions = {
    matrixParams: "ignored",
    queryParams: "ignored",
    fragment: "ignored",
    paths: "exact",
  };

  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : [])),
  );
  isInBatch$: Observable<boolean>;

  constructor(
    public appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private store: Store,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.isInBatch$ = this.store.select(selectIsCurrentDatasetInBatch);

    this.subscriptions.push(
      this.route.params
        .pipe(map((params) => params["id"]))
        .subscribe((id: string) => {
          if (id) {
            this.store.dispatch(
              fetchDatasetAction({ pid: id, filters: ["all"] }),
            );
          }
        }),
    );

    this.subscriptions.push(
      combineLatest([
        this.dataset$,
        this.accessGroups$,
        this.isAdmin$,
        this.loggedIn$,
      ]).subscribe(([dataset, groups, isAdmin, isLoggedIn]) => {
        if (!dataset) return;

        this.dataset = dataset;

        const isInOwnerGroup =
          groups.indexOf(this.dataset.ownerGroup) !== -1 || isAdmin;

        this.navLinks = TAB_DEFINITIONS.filter((tab) =>
          tab.isEnabled({
            isLoggedIn,
            isAdmin,
            isInOwnerGroup,
            isPublished: dataset.isPublished,
            hasAccessToLogbook:
              isInOwnerGroup ||
              (dataset.accessGroups ?? []).some((g) => groups.includes(g)),
            config: this.appConfig,
          }),
        );
      }),
    );

    this.subscriptions.push(
      this.dataset$
        .pipe(
          filter(Boolean),
          distinctUntilChanged((a, b) => a.pid === b.pid),
        )
        .subscribe(() => {
          this.store.dispatch(fetchRelatedDatasetsAction());
          this.fetchDatasetRelatedDocuments();
        }),
    );
  }

  fetchDatasetRelatedDocuments(): void {
    if (this.dataset) {
      this.store.dispatch(clearCurrentProposalStateAction());
      this.store.dispatch(clearCurrentSampleStateAction());
      this.store.dispatch(clearCurrentInstrumentStateAction());
      if (this.dataset.proposalIds?.length > 0) {
        this.dataset.proposalIds.forEach((proposalId) => {
          this.store.dispatch(
            fetchProposalAction({
              proposalId: proposalId,
            }),
          );
        });
      } else {
        this.store.dispatch(clearLogbookAction());
      }
      if (this.dataset.sampleIds?.length > 0) {
        this.dataset.sampleIds.forEach((sampleId) => {
          this.store.dispatch(fetchSampleAction({ sampleId: sampleId }));
        });
      }
      if (this.dataset.instrumentIds?.length > 0) {
        this.dataset.instrumentIds.forEach((instrumentId) => {
          this.store.dispatch(
            fetchInstrumentAction({
              pid: instrumentId,
            }),
          );
        });
      }
    }
  }

  onAddToBatch(): void {
    this.store.dispatch(fromDatasetActions.addCurrentToBatchAction());
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
