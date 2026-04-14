import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { submitJobAction } from "state-management/actions/jobs.actions";
import {
  selectCurrentUser,
  selectTapeCopies,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { RetrieveDestinations } from "app-config.service";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { DynamicDialogData } from "shared/modules/dialog/dialog.component";

type JobType = "archive" | "retrieve" | "markForDeletion";

@Injectable()
export class ArchivingService {
  private currentUser$ = this.store.select(selectCurrentUser);
  private tapeCopies$ = this.store.select(selectTapeCopies);

  constructor(private store: Store) {}

  private createJob(
    user: ReturnedUserDto,
    datasets: OutputDatasetObsoleteDto[],
    jobType: JobType,
    additionalJobParams: Record<string, string> = {},
    // Do not specify tape copies here
  ) {
    const jobParams = {
      username: user.username,
      ...additionalJobParams,
    };

    this.store.select(selectProfile).subscribe((profile) => {
      user.email = profile.email;
    });

    const data = {
      jobParams,
      emailJobInitiator: user.email,
      // Revise this, files == []...? See earlier version of this method in dataset-table component for context
      datasetList: datasets.map((dataset) => ({
        pid: dataset.pid,
        files: [],
      })),
      type: jobType,
    };

    return data;
  }

  private archiveOrRetrieve(
    datasets: OutputDatasetObsoleteDto[],
    jobType: JobType,
    additionalJobParams: Record<string, string> = {},
  ): Observable<void> {
    return combineLatest([this.currentUser$, this.tapeCopies$]).pipe(
      first(),
      map(([user, tapeCopies]) => {
        if (user) {
          const email = user.email;
          if (email == null || email.length === 0) {
            throw new Error(
              "No email for this user could be found, the job will not be submitted",
            );
          }

          if (datasets.length === 0) {
            throw new Error("No datasets selected");
          }

          const job = this.createJob(
            user,
            datasets,
            jobType,
            additionalJobParams,
          );

          this.store.dispatch(submitJobAction({ job: job as any }));
        }
      }),
    );
  }

  public archive(datasets: OutputDatasetObsoleteDto[]): Observable<void> {
    return this.archiveOrRetrieve(datasets, "archive");
  }

  public retrieve(
    datasets: OutputDatasetObsoleteDto[],
    additionalJobParams: Record<string, string>,
  ): Observable<void> {
    return this.archiveOrRetrieve(datasets, "retrieve", additionalJobParams);
  }

  public markForDeletion(
    datasets: OutputDatasetObsoleteDto[],
    additionalJobParams: Record<string, string>,
  ): Observable<void> {
    return this.archiveOrRetrieve(
      datasets,
      "markForDeletion",
      additionalJobParams,
    );
  }

  public generateOptionLocation(
    result: RetrieveDestinations,
    retrieveDestinations: RetrieveDestinations[] = [],
  ): object | { option: string } | { location: string; option: string } {
    if (retrieveDestinations.length > 0) {
      const prefix = retrieveDestinations.filter(
        (element) => element.option == result.option,
      );
      let location =
        prefix.length > 0
          ? (prefix[0].location || "") + (result.location || "")
          : "";
      let option = result.option;
      if (!result.option) {
        location = retrieveDestinations[0].location || "";
        option = retrieveDestinations[0].option;
      }
      return {
        option: option,
        ...(location != "" ? { location: location } : {}),
      };
    }
    return {};
  }

  public retriveDialogOptions(
    retrieveDestinations: RetrieveDestinations[] = [],
  ): object {
    return {
      width: "auto",
      data: {
        title: "Retrieve to",
        question: "",
        choice: {
          options: retrieveDestinations,
        },
        option: retrieveDestinations?.[0]?.option,
      },
    };
  }

  public markForDeletionDialogOptions(deletiionCodes: string[] = []): {
    data: DynamicDialogData;
    width: string;
  } {
    return {
      width: "auto",
      data: {
        title: "Mark for deletion reason",
        additionalFields: {
          deletiionCode: {
            label: "Deletion code",
            type: "select",
            required: true,
            options: deletiionCodes.map((code) => ({
              label: code,
              value: code,
            })),
          },
          explanation: {
            label: "Explanation for deletion",
            type: "textarea",
            required: true,
          },
        },
      },
    };
  }
}
