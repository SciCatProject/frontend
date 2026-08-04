import { Component, OnInit, OnDestroy } from "@angular/core";
import { ArchViewMode } from "state-management/models";
import { Store } from "@ngrx/store";
import {
  setArchiveViewModeAction,
  clearSelectionAction,
  addToBatchAction,
  clearBatchAction,
} from "state-management/actions/datasets.actions";
import { combineLatest, Subscription } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
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
import { selectSubmitError } from "state-management/selectors/jobs.selectors";
import { AppConfigService } from "app-config.service";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
import {
  ActionConfig,
  ActionButtonStyle,
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
  actionItems: ActionItems = { datasets: [] };
  userProfile$ = this.store.select(selectProfile);
  selectSelectedDatasets$ = this.store.select(selectSelectedDatasets);
  selectIsBatchNonEmpty$ = this.store.select(selectIsBatchNonEmpty);
  batchActionsConfig: ActionConfig[] = this.appConfig.batchActions || [];

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

  private buildBatchActionsConfig(isBatchNonEmpty: boolean): ActionConfig[] {
    const batchActions = this.appConfig.batchActions || [];
    if (!isBatchNonEmpty) {
      return batchActions;
    }

    return batchActions.map((action) => ({
      ...action,
      disabled: true,
    }));
  }

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
      this.selectIsBatchNonEmpty$
        .pipe(distinctUntilChanged())
        .subscribe((isBatchNonEmpty) => {
          this.batchActionsConfig =
            this.buildBatchActionsConfig(isBatchNonEmpty);
        }),
    );

    this.subscriptions.push(
      this.store
        .select(selectSubmitError)
        .pipe(distinctUntilChanged())
        .subscribe((err) => {
          if (!err) {
            this.store.dispatch(clearSelectionAction());
          }
        }),
    );
    this.subscriptions.push(
      combineLatest([
        this.userProfile$.pipe(distinctUntilChanged()),
        this.store.select(selectArchiveViewMode).pipe(distinctUntilChanged()),
        this.selectSelectedDatasets$.pipe(distinctUntilChanged()),
      ]).subscribe(([profile, mode, datasets]) => {
        this.selectedSets = datasets;
        this.currentArchViewMode = mode;
        this.actionItems = {
          datasets: datasets,
          user: profile,
          currentArchViewMode: mode,
        };
      }),
    );
  }

  onActionFinished(event: { success: boolean }) {
    if (!event.success) return;
    this.store.dispatch(clearSelectionAction());
    this.store.dispatch(clearBatchAction());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
