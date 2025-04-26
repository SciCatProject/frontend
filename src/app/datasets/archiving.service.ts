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
import {
  selectIsAdmin,
  selectUserSettingsPageViewModel,
} from "state-management/selectors/user.selectors";

@Injectable()
export class ArchivingService {
  private currentUser$ = this.store.select(selectCurrentUser);
  private tapeCopies$ = this.store.select(selectTapeCopies);
  user$ = this.store.select(selectUserSettingsPageViewModel);
  isAdmin$ = this.store.select(selectIsAdmin);
  userGroups$: string[] = [];

  constructor(private store: Store) {}

  private createJob(
    user: ReturnedUserDto,
    datasets: OutputDatasetObsoleteDto[],
    archive: boolean,
    destinationPath?: Record<string, string>,
    ownerGroup?: string,
    // Do not specify tape copies here
  ) {
    const extra = archive ? {} : destinationPath;
    const jobParams = {
      datasetList: datasets.map((dataset) => ({
        pid: dataset.pid,
        files: [],
      })),
      ...extra,
    };

    this.store.select(selectProfile).subscribe((profile) => {
      user.email = profile.email;
    });

    const data = {
      jobParams,
      ownerGroup,
      contactEmail: user.email,
      type: archive ? "archive" : "retrieve",
    };

    return data;
  }

  private archiveOrRetrieve(
    datasets: OutputDatasetObsoleteDto[],
    ownerGroup: string,
    archive: boolean,
    destPath?: Record<string, string>,
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

          const job = this.createJob(user, datasets, archive, destPath, ownerGroup);

          this.store.dispatch(submitJobAction({ job: job as any }));
        }
      }),
    );
  }

  public archive(datasets: OutputDatasetObsoleteDto[], ownerGroup: string): Observable<void> {
    return this.archiveOrRetrieve(datasets, ownerGroup, true);
  }

  public retrieve(
    datasets: OutputDatasetObsoleteDto[],
    destinationPath: Record<string, string>,
    ownerGroup: string,
  ): Observable<void> {
    return this.archiveOrRetrieve(datasets, ownerGroup, false, destinationPath);
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
    this.user$.subscribe((settings) => {
      this.userGroups$ = settings.profile.accessGroups;
    });

    return {
      width: "auto",
      data: {
        title: "Retrieve to",
        question: "Please select destination and ownerGroup for the retrieve job.",
        choice: {
          options: retrieveDestinations,
        },
        option: retrieveDestinations?.[0]?.option,
        group: {
          options: this.userGroups$,
        },
        groupOption: this.userGroups$?.[0],
      },
    };
  }
}
