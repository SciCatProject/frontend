import { Component, OnInit, OnDestroy } from "@angular/core";
import { ArchViewMode } from "state-management/models";
import { Store } from "@ngrx/store";
import {
  setArchiveViewModeAction,
  clearSelectionAction,
  addToBatchAction,
} from "state-management/actions/datasets.actions";
import { combineLatest, Subscription } from "rxjs";
import {
  selectArchiveViewMode,
  selectIsBatchNonEmpty,
  selectSelectedDatasets,
} from "state-management/selectors/datasets.selectors";
import {
  selectIsLoading,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { MatDialog } from "@angular/material/dialog";
import { showMessageAction } from "state-management/actions/user.actions";
import { selectSubmitError } from "state-management/selectors/jobs.selectors";
import { AppConfigService } from "app-config.service";
import {
  OutputDatasetObsoleteDto,
  UserProfile,
} from "@scicatproject/scicat-sdk-ts-angular";
import {
  ActionButtonStyle,
  ActionItemDataset,
  ActionItems,
} from "shared/modules/configurable-actions/configurable-action.interfaces";

@Component({
  selector: "dataset-table-actions",
  templateUrl: "./dataset-table-actions.component.html",
  styleUrls: ["./dataset-table-actions.component.scss"],
  standalone: false,
})
export class DatasetTableActionsComponent implements OnInit, OnDestroy {
  appConfig = this.appConfigService.getConfig();
  loading$ = this.store.select(selectIsLoading);
  actionButtonsStyle: ActionButtonStyle = { raised: false, color: "primary" };
  actionItems: ActionItems;
  userProfile$ = this.store.select(selectProfile);
  selectSelectedDatasets$ = this.store.select(selectSelectedDatasets);
  selectIsBatchNonEmpty$ = this.store.select(selectIsBatchNonEmpty);

  selectedSets: OutputDatasetObsoleteDto[] | null = [];

  public currentArchViewMode: ArchViewMode = ArchViewMode.all;
  public viewModes = ArchViewMode;
  modes = [
    ArchViewMode.all,
    ArchViewMode.archivable,
    ArchViewMode.retrievable,
    ArchViewMode.work_in_progress,
    ArchViewMode.system_error,
    ArchViewMode.user_error,
  ];

  searchPublicDataEnabled = this.appConfig.searchPublicDataEnabled;

  subscriptions: Subscription[] = [];

  constructor(
    private appConfigService: AppConfigService,
    public dialog: MatDialog,
    private store: Store,
  ) {}

  /**
   * Handle changing of view mode and disabling selected rows
   * @param mode
   */
  onModeChange(mode: ArchViewMode): void {
    this.store.dispatch(setArchiveViewModeAction({ modeToggle: mode }));
    this.store.dispatch(clearSelectionAction());
  }

  isEmptySelection(): boolean {
    return this.selectedSets?.length === 0;
  }

  onAddToBatch(): void {
    this.store.dispatch(addToBatchAction());
    this.store.dispatch(clearSelectionAction());
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store
        .select(selectArchiveViewMode)
        .subscribe((mode: ArchViewMode) => {
          this.currentArchViewMode = mode;
        }),
    );

    this.subscriptions.push(
      this.store.select(selectSubmitError).subscribe((err) => {
        if (!err) {
          this.store.dispatch(clearSelectionAction());
        }
      }),
    );
    this.subscriptions.push(
      combineLatest([
        this.userProfile$,
        this.store.select(selectArchiveViewMode),
        this.selectSelectedDatasets$,
      ]).subscribe(([profile, mode, datasets]) => {
        this.selectedSets = datasets;
        this.currentArchViewMode = mode;
        this.actionItems = {
          datasets: datasets as ActionItemDataset[],
          user: profile as UserProfile,
          currentArchViewMode: mode,
        };
      }),
    );
  }

  onActionFinished(event: { success: boolean }) {
    if (event.success) this.store.dispatch(clearSelectionAction());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
