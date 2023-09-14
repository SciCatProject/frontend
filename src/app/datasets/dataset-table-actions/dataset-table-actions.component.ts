import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ArchViewMode, MessageType, Dataset } from "state-management/models";
import { Store } from "@ngrx/store";
import {
  setPublicViewModeAction,
  setArchiveViewModeAction,
  clearSelectionAction,
  addToBatchAction,
} from "state-management/actions/datasets.actions";
import { Subscription } from "rxjs";
import {
  selectArchiveViewMode,
  selectPublicViewMode,
} from "state-management/selectors/datasets.selectors";
import { selectIsLoading } from "state-management/selectors/user.selectors";
import { ArchivingService } from "datasets/archiving.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { showMessageAction } from "state-management/actions/user.actions";
import { selectSubmitError } from "state-management/selectors/jobs.selectors";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "dataset-table-actions",
  templateUrl: "./dataset-table-actions.component.html",
  styleUrls: ["./dataset-table-actions.component.scss"],
})
export class DatasetTableActionsComponent implements OnInit, OnDestroy {
  appConfig = this.appConfigService.getConfig();
  loading$ = this.store.select(selectIsLoading);

  @Input() selectedSets: Dataset[] | null = [];

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
  currentPublicViewMode: boolean | "" = "";

  subscriptions: Subscription[] = [];

  constructor(
    private appConfigService: AppConfigService,
    private archivingSrv: ArchivingService,
    public dialog: MatDialog,
    private store: Store,
  ) {}

  /**
   * Handle changing of view mode and disabling selected rows
   * @param mode
   */
  onModeChange(mode: ArchViewMode): void {
    this.store.dispatch(setArchiveViewModeAction({ modeToggle: mode }));
  }

  onViewPublicChange(value: boolean): void {
    this.currentPublicViewMode = value;
    this.store.dispatch(
      setPublicViewModeAction({ isPublished: this.currentPublicViewMode }),
    );
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
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "auto",
      data: { title: "Really archive?", question: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.selectedSets) {
        this.archivingSrv.archive(this.selectedSets).subscribe(
          () => this.store.dispatch(clearSelectionAction()),
          (err) =>
            this.store.dispatch(
              showMessageAction({
                message: {
                  type: MessageType.Error,
                  content: err.message,
                  duration: 5000,
                },
              }),
            ),
        );
      }
    });
  }

  /**
   * Sends retrieve command for selected datasets
   * @memberof DashboardComponent
   */
  retrieveClickHandle(): void {
    const destPath = { destinationPath: "/archive/retrieve" };
    const dialogOptions = this.archivingSrv.retriveDialogOptions(
      this.appConfig.retrieveDestinations,
    );
    const dialogRef = this.dialog.open(DialogComponent, dialogOptions);
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.selectedSets) {
        const locationOption = this.archivingSrv.generateOptionLocation(
          result,
          this.appConfig.retrieveDestinations,
        );
        const extra = { ...destPath, ...locationOption };
        this.archivingSrv.retrieve(this.selectedSets, extra).subscribe(
          () => this.store.dispatch(clearSelectionAction()),
          (err) =>
            this.store.dispatch(
              showMessageAction({
                message: {
                  type: MessageType.Error,
                  content: err.message,
                  duration: 5000,
                },
              }),
            ),
        );
      }
    });
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
      this.store.select(selectPublicViewMode).subscribe((publicViewMode) => {
        this.currentPublicViewMode = publicViewMode;
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
