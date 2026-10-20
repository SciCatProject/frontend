import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import {
  ArchViewMode,
  DatasetViewMode,
  DatasetViewModeCheckbox,
} from "state-management/models";
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
  selectArchiveViewModeChecked,
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
import {
  ActionConfig,
  ActionButtonStyle,
  ActionItems,
} from "shared/modules/configurable-actions/configurable-action.interfaces";
import { PartialOutputDatasetDto } from "@scicatproject/scicat-sdk-ts-angular";
import {
  buildViewModeQuery,
  checkboxAppliesTo,
  ViewModeUser,
} from "datasets/dataset-view-modes.utils";

@Component({
  selector: "dataset-table-actions",
  templateUrl: "./dataset-table-actions.component.html",
  styleUrls: ["./dataset-table-actions.component.scss"],
  standalone: false,
})
export class DatasetTableActionsComponent implements OnInit, OnDestroy {
  private user: ViewModeUser | null = null;
  appConfig = this.appConfigService.getConfig();
  loading$ = this.store.select(selectIsLoading);
  actionButtonsStyle: ActionButtonStyle = { raised: false, color: "primary" };
  actionItems: ActionItems = { datasets: [] };
  userProfile$ = this.store.select(selectProfile);
  selectSelectedDatasets$ = this.store.select(selectSelectedDatasets);
  selectIsBatchNonEmpty$ = this.store.select(selectIsBatchNonEmpty);
  batchActionsConfig: ActionConfig[] = this.appConfig.batchActions || [];

  @Input() selectedSets: PartialOutputDatasetDto[] | null = [];

  public currentArchViewMode: string = ArchViewMode.all;
  currentArchViewModeChecked = false;
  modes: DatasetViewMode[] = this.appConfig.datasetViews?.modes ?? [];
  modesDisplay = this.appConfig.datasetViews?.display ?? "buttons";
  modesLabel = this.appConfig.datasetViews?.label ?? "Archive status";

  // the dropdown gets an implicit "All" option unless one is configured
  allModeId: string = ArchViewMode.all;
  hasAllMode = this.modes.some((m) => m.id === ArchViewMode.all);

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
      // a boolean disabled would take precedence and hide the tooltip
      disabled: undefined,
      enabled: {
        conditions: [
          {
            condition: "false",
            disabledTooltip:
              "Actions are disabled while datasets are in your Selection. Use the actions on the Selection page, or empty the Selection.",
          },
        ],
      },
    }));
  }

  private setViewMode(
    id: string,
    mode: DatasetViewMode | undefined,
    checked: boolean,
  ): void {
    this.store.dispatch(
      setArchiveViewModeAction({
        modeToggle: id,
        mode: buildViewModeQuery(mode, checked, this.user),
        checked,
      }),
    );
    // rows selected under the previous query may not match the new one
    this.store.dispatch(clearSelectionAction());
  }

  get selectedMode(): DatasetViewMode | undefined {
    return this.modes.find((m) => m.id === this.currentArchViewMode);
  }

  // whether any view shows a checkbox to this user
  get hasModeCheckbox(): boolean {
    return this.modes.some((m) => checkboxAppliesTo(m, this.user));
  }

  get selectedModeCheckbox(): DatasetViewModeCheckbox | undefined {
    const mode = this.selectedMode;
    return checkboxAppliesTo(mode, this.user) ? mode?.checkbox : undefined;
  }

  /**
   * Handle changing of view mode and disabling selected rows
   * @param id the id of the selected view mode
   */
  onModeChange(id: string): void {
    const mode = this.modes.find((m) => m.id === id);
    const checked =
      checkboxAppliesTo(mode, this.user) && mode?.checkbox?.default !== false;
    this.setViewMode(id, mode, checked);
  }

  onModeCheckboxChange(checked: boolean): void {
    this.setViewMode(this.currentArchViewMode, this.selectedMode, checked);
  }

  isEmptySelection(): boolean {
    return this.selectedSets?.length === 0;
  }

  onAddToBatch(): void {
    this.store.dispatch(
      addToBatchAction({ addedFrom: this.currentArchViewMode }),
    );
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
      this.store
        .select(selectArchiveViewModeChecked)
        .subscribe((checked) => (this.currentArchViewModeChecked = checked)),
    );
    this.subscriptions.push(
      combineLatest([
        this.userProfile$.pipe(distinctUntilChanged()),
        this.store.select(selectArchiveViewMode).pipe(distinctUntilChanged()),
        this.selectSelectedDatasets$.pipe(distinctUntilChanged()),
      ]).subscribe(([profile, mode, datasets]) => {
        this.user = profile;
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
