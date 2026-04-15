import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ArchViewMode } from "state-management/models";
import { Store } from "@ngrx/store";
import {
  setArchiveViewModeAction,
  clearSelectionAction,
  addToBatchAction,
} from "state-management/actions/datasets.actions";
import { Subscription } from "rxjs";
import { selectArchiveViewMode } from "state-management/selectors/datasets.selectors";
import { selectIsLoading } from "state-management/selectors/user.selectors";
import { selectSubmitError } from "state-management/selectors/jobs.selectors";
import { AppConfigService } from "app-config.service";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
import {
  ActionConfig,
  ActionItemDataset,
  ActionItems,
} from "shared/modules/configurable-actions/configurable-action.interfaces";

@Component({
  selector: "dataset-table-actions",
  templateUrl: "./dataset-table-actions.component.html",
  styleUrls: ["./dataset-table-actions.component.scss"],
  standalone: false,
})
export class DatasetTableActionsComponent
  implements OnInit, OnDestroy, OnChanges
{
  appConfig = this.appConfigService.getConfig();
  loading$ = this.store.select(selectIsLoading);

  @Input() selectedSets: OutputDatasetObsoleteDto[] | null = [];

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
  selectionActionsEnabled = this.appConfig.datasetSelectionActionsEnabled;
  selectionActionsConfig: ActionConfig[] =
    this.appConfig.datasetSelectionActions ?? [];
  actionItems: ActionItems = {
    datasets: [],
  };

  subscriptions: Subscription[] = [];
  markForDeletion = this.appConfig.markForDeletionCodes?.length > 0;

  constructor(
    private appConfigService: AppConfigService,
    private store: Store,
  ) {}

  /**
   * Handle changing of view mode and disabling selected rows
   * @param mode
   */
  onModeChange(mode: ArchViewMode): void {
    this.store.dispatch(setArchiveViewModeAction({ modeToggle: mode }));
  }

  isEmptySelection(): boolean {
    return this.selectedSets?.length === 0;
  }

  get filteredSelectionActions(): ActionConfig[] {
    return this.selectionActionsConfig.filter((action) => {
      const mode = action.archiveViewMode;
      const matchesMode = Array.isArray(mode)
        ? mode.includes(this.currentArchViewMode)
        : !mode || mode === this.currentArchViewMode;

      const supportsDeletion = !action.requiresMarkForDeletionCodes
        ? true
        : this.markForDeletion;

      return matchesMode && supportsDeletion;
    });
  }

  private updateActionItems(): void {
    this.actionItems.datasets = (this.selectedSets ??
      []) as ActionItemDataset[];
  }

  onAddToBatch(): void {
    this.store.dispatch(addToBatchAction());
    this.store.dispatch(clearSelectionAction());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedSets"]) {
      this.updateActionItems();
    }
  }

  ngOnInit() {
    this.updateActionItems();

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
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
