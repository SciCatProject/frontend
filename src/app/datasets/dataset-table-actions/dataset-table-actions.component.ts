import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ArchViewMode, MessageType } from "state-management/models";
import { Store } from "@ngrx/store";
import {
  setArchiveViewModeAction,
  clearSelectionAction,
  addToBatchAction,
} from "state-management/actions/datasets.actions";
import { Subscription } from "rxjs";
import { selectArchiveViewMode } from "state-management/selectors/datasets.selectors";
import { selectIsLoading } from "state-management/selectors/user.selectors";
import { ArchivingService } from "datasets/archiving.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { showMessageAction } from "state-management/actions/user.actions";
import { selectSubmitError } from "state-management/selectors/jobs.selectors";
import { AppConfigService } from "app-config.service";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
import { DatasetJobDialogService } from "datasets/dataset-job-dialog.service";

@Component({
  selector: "dataset-table-actions",
  templateUrl: "./dataset-table-actions.component.html",
  styleUrls: ["./dataset-table-actions.component.scss"],
  standalone: false,
})
export class DatasetTableActionsComponent implements OnInit, OnDestroy {
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

  subscriptions: Subscription[] = [];
  markForDeletion = this.appConfig.markForDeletionCodes?.length > 0;

  constructor(
    private appConfigService: AppConfigService,
    private archivingSrv: ArchivingService,
    public dialog: MatDialog,
    private datasetJobDialogService: DatasetJobDialogService,
    private store: Store,
  ) { }

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

  /**
   * Sends archive command for selected datasets (default includes all
   * datablocks for now) to Dacat API
   * @memberof DashboardComponent
   */
  archiveClickHandle(): void {
    const dialogOptions = {
      width: "auto",
      data: { title: "Really archive?", question: "" },
    };
    this.datasetJobDialogService.submitJobWithDialog(
      dialogOptions,
      this.selectedSets,
      "archive",
      undefined,
    );
  }

  /**
   * Sends retrieve command for selected datasets
   * @memberof DashboardComponent
   */
  retrieveClickHandle(): void {
    const dialogOptions = this.archivingSrv.retriveDialogOptions(
      this.appConfig.retrieveDestinations,
    );
    this.datasetJobDialogService.submitJobWithDialog(
      dialogOptions,
      this.selectedSets,
      "retrieve",
      (result) => {
        const destPath = { destinationPath: "/archive/retrieve" };
        const locationOption = this.archivingSrv.generateOptionLocation(
          result,
          this.appConfig.retrieveDestinations,
        );
        return { ...destPath, ...locationOption };
      },
    );
  }

  markForDeletionClickHandle(): void {
    const dialogOptions = this.archivingSrv.markForDeletionDialogOptions(
      this.appConfig.markForDeletionCodes,
    );
    this.datasetJobDialogService.submitJobWithDialog(
      dialogOptions,
      this.selectedSets,
      "markForDeletion",
      (result) => ({
        deletionCode: result.selectedOption,
        explanation: result.explanation,
      }),
    );
  }

  onAddToBatch(): void {
    this.store.dispatch(addToBatchAction());
    this.store.dispatch(clearSelectionAction());
  }

  ngOnInit() {
    // Register success callbacks for dataset operations
    this.datasetJobDialogService.registerSuccessCallback(
      () => this.store.dispatch(clearSelectionAction()),
    );
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
