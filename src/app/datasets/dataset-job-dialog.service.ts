import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
import { filter, Observable, switchMap, throwError } from "rxjs";
import { showMessageAction } from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { ArchivingService, DialogOptions } from "./archiving.service";

@Injectable()
export class DatasetJobDialogService {
  private successCallback: Set<() => void> = new Set();

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private archivingService: ArchivingService,
  ) {}

  /**
   * Register a success callback for a specific job type.
   * Called during component initialization.
   */
  registerSuccessCallback(callback: () => void): void {
    this.successCallback.add(callback);
  }

  getJobObservable(
    datasets: OutputDatasetObsoleteDto[],
    jobType: string,
    additionalParams: Record<string, string> = {},
  ): Observable<void> {
    // This method should call the appropriate method on ArchivingService based on jobType
    // For example:
    return this.archivingService.submitJob(datasets, jobType, additionalParams);
  }

  /**
   * Submit a job via dialog. Dialog result is used to extract additional parameters.
   * Handles subscription and error dispatching automatically.
   */
  submitJobWithDialog(
    dialogOptions: DialogOptions,
    datasets: OutputDatasetObsoleteDto[] | null,
    jobType: string,
    additionalParamsExtractor?: (result: any) => Record<string, string>,
  ): void {
    const dialogSubscription = this.dialog
      .open(DialogComponent, dialogOptions)
      .afterClosed()
      .pipe(
        filter((result) => !!result && !!datasets),
        switchMap((result) => {
          const extra = additionalParamsExtractor?.(result) ?? {};
          return this.getJobObservable(
            datasets as OutputDatasetObsoleteDto[],
            jobType,
            extra,
          );
        }),
      );
    return this.subscribeWithHandlers(dialogSubscription);
  }

  /**
   * Subscribe to a job observable with common error and success handlers.
   * @private
   */
  private subscribeWithHandlers(
    observable: Observable<void>,
    handler: () => void = undefined,
  ): void {
    observable.subscribe({
      next: () => (handler ? handler() : this.callSuccessHandler()),
      error: (err) => this.handleError(err),
    });
  }

  /**
   * Call the registered success callback for all job types.
   * @private
   */
  private callSuccessHandler(): void {
    this.successCallback.values().next().value?.();
  }

  /**
   * Dispatch an error message to the store.
   * @private
   */
  private handleError(err: any): void {
    const errorMessage = err?.message ?? "Unexpected error";
    this.store.dispatch(
      showMessageAction({
        message: {
          type: MessageType.Error,
          content: errorMessage,
          duration: 5000,
        },
      }),
    );
  }
}
