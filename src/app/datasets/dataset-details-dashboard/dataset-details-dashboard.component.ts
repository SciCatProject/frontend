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
import {
  ActivatedRoute,
  IsActiveMatchOptions,
  NavigationEnd,
  Router,
} from "@angular/router";
import { Subscription, Observable, combineLatest } from "rxjs";
import { distinctUntilChanged, filter, map, startWith } from "rxjs/operators";
import * as fromDatasetActions from "state-management/actions/datasets.actions";
import {
  clearCurrentDatasetStateAction,
  fetchDatasetAction,
  fetchOrigDatablocksAction,
  fetchOrigDatablocksCountAction,
  fetchRelatedDatasetsAction,
  fetchRelatedDatasetsCountAction,
} from "state-management/actions/datasets.actions";
import { MatDialog } from "@angular/material/dialog";
import {
  AppConfigService,
  DATASET_INCLUDE_FIELDS,
  DatasetIncludeField,
} from "app-config.service";

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

// Tab identifiers, matching the child route paths of the dataset details dashboard.
enum TAB_ID {
  details = "details",
  datafiles = "datafiles",
  relatedDatasets = "relatedDatasets",
  relationships = "relationships",
  reduce = "reduce",
  logbook = "logbook",
  attachments = "attachments",
  admin = "admin",
  lifecycle = "lifecycle",
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
    location: "./relationships",
    label: TAB.relationships,
    icon: "device_hub",
    isEnabled: (c) => c.config.datasetRelationshipsEnabled,
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

// Used when `datasetDetailsTabsInclude.details` is not configured.
const DEFAULT_DETAILS_INCLUDE: DatasetIncludeField[] = ["attachments"];

// Documents the other tabs need to show anything. Tabs not listed here only
// use fields of the dataset itself and request no includes.
const TABS_INCLUDE: Partial<Record<TAB_ID, DatasetIncludeField[]>> = {
  [TAB_ID.datafiles]: ["origdatablocks"],
  [TAB_ID.attachments]: ["attachments"],
  [TAB_ID.admin]: ["datablocks"],
};

// what "all" means for the dataset request, origdatablocks are paginated
// separately (see fetchDataForTab)
const INCLUDE_ALL_EXCEPT_ORIGDATABLOCKS: DatasetIncludeField[] = [
  "instruments",
  "proposals",
  "datablocks",
  "attachments",
  "samples",
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
  private currentPid: string | null = null;
  private loadedTabs = new Set<string>();
  // `include` values already requested for the current dataset. They are sent
  // again on every fetch so the store keeps the complete set of loaded data.
  private fetchedInclude = new Set<DatasetIncludeField>();

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
    private router: Router,
    private store: Store,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.isInBatch$ = this.store.select(selectIsCurrentDatasetInBatch);

    const pid$ = this.route.params.pipe(
      map((params) => params["id"]),
      filter((pid): pid is string => !!pid),
      distinctUntilChanged(),
    );

    const activeTab$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.getActiveTabId()),
      distinctUntilChanged(),
    );

    this.subscriptions.push(
      combineLatest([pid$, activeTab$]).subscribe(([pid, tab]) => {
        if (pid !== this.currentPid) {
          this.currentPid = pid;
          this.loadedTabs.clear();
          this.fetchedInclude.clear();
        }
        this.fetchDataForTab(pid, tab);
      }),
    );

    this.subscriptions.push(
      combineLatest([
        this.dataset$,
        this.accessGroups$,
        this.isAdmin$,
        this.loggedIn$,
      ])
        .pipe(filter(([dataset]) => !!dataset))
        .subscribe(([dataset, groups, isAdmin, isLoggedIn]) => {
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
          this.store.dispatch(fetchRelatedDatasetsCountAction());
        }),
    );
  }

  getActiveTabId(): string {
    const path = this.route.snapshot.firstChild?.url?.[0]?.path;
    return path || TAB_ID.details;
  }

  // Fetches the dataset with the `include` values configured for the given tab,
  // together with the ones already loaded, so that the store always holds the
  // complete set of data fetched so far for this dataset.
  fetchDataForTab(pid: string, tab: string): void {
    let tabInclude = this.getTabInclude(tab);

    // origdatablocks can hold a huge number of files, so instead of including
    // them in the dataset they are fetched page by page (one row per file)
    // from the origdatablocks files endpoint
    const includesAll = tabInclude.includes("all");
    if (includesAll || tabInclude.includes("origdatablocks")) {
      this.store.dispatch(fetchOrigDatablocksAction({ pid }));
      this.store.dispatch(fetchOrigDatablocksCountAction({ pid }));
    }
    tabInclude = includesAll
      ? INCLUDE_ALL_EXCEPT_ORIGDATABLOCKS
      : tabInclude.filter((include) => include !== "origdatablocks");

    const isNewTab = !this.loadedTabs.has(tab);
    const hasNewInclude = tabInclude.some(
      (include) => !this.fetchedInclude.has(include),
    );

    if (!isNewTab && !hasNewInclude) {
      return;
    }

    this.loadedTabs.add(tab);
    tabInclude.forEach((include) => this.fetchedInclude.add(include));

    if (this.dataset?.pid === pid && !hasNewInclude) {
      return;
    }

    this.store.dispatch(
      fetchDatasetAction({ pid, filters: [...this.fetchedInclude] }),
    );
  }

  // Only the details tab includes are configurable, the other tabs request
  // the fixed includes they need.
  private getTabInclude(tab: string): DatasetIncludeField[] {
    if (tab !== TAB_ID.details) {
      return TABS_INCLUDE[tab as TAB_ID] ?? [];
    }

    const configuredInclude: unknown =
      this.appConfig.datasetDetailsTabsInclude?.details ??
      DEFAULT_DETAILS_INCLUDE;
    if (!Array.isArray(configuredInclude)) {
      console.error(
        `Ignoring invalid dataset includes for tab "${tab}": expected an array.`,
      );
      return [];
    }
    return configuredInclude.filter(
      (include): include is DatasetIncludeField => {
        if (DATASET_INCLUDE_FIELDS.some((field) => field === include)) {
          return true;
        }
        console.error(
          `Ignoring unsupported dataset include for tab "${tab}":`,
          include,
        );
        return false;
      },
    );
  }

  onAddToBatch(): void {
    this.store.dispatch(fromDatasetActions.addCurrentToBatchAction());
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.store.dispatch(clearCurrentDatasetStateAction());
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
