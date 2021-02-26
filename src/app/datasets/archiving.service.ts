import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";

import { combineLatest, Observable } from "rxjs";
import { first, map } from "rxjs/operators";

import { Dataset, Job, User } from "state-management/models";
import { submitJobAction } from "state-management/actions/jobs.actions";
import {
  getCurrentUser,
  getTapeCopies,
  getProfile
} from "state-management/selectors/user.selectors";

@Injectable()
export class ArchivingService {
  private currentUser$ = this.store.pipe(select(getCurrentUser));
  private tapeCopies$ = this.store.pipe(select(getTapeCopies));

  constructor(private store: Store<any>) {}

  private createJob(
    user: User,
    datasets: Dataset[],
    archive: boolean,
    destinationPath: string
    // Do not specify tape copies here
  ): Job {
    const extra = archive ? {} : { destinationPath };
    const jobParams = {
      username: user.username,
      ...extra
    };

    this.store.pipe(select(getProfile)).subscribe(profile => {
      user.email = profile.email;
    });

    const data = {
      jobParams,
      emailJobInitiator: user.email,
      creationTime: new Date(),
      // Revise this, files == []...? See earlier version of this method in dataset-table component for context
      datasetList: datasets.map(dataset => ({
        pid: dataset.pid,
        files: []
      })),
      type: archive ? "archive" : "retrieve"
    };

    return new Job(data);
  }

  private archiveOrRetrieve(
    datasets: Dataset[],
    archive: boolean,
    destPath?: string
  ): Observable<void> {
    return combineLatest([this.currentUser$, this.tapeCopies$]).pipe(
      first(),
      map(([user, tapeCopies]) => {
        const email = user.email;
        if (email == null || email.length === 0) {
          throw new Error(
            "No email for this user could be found, the job will not be submitted"
          );
        }

        if (datasets.length === 0) {
          throw new Error("No datasets selected");
        }

        const job = this.createJob(user, datasets, archive, destPath);

        this.store.dispatch(submitJobAction({ job }));
      })
    );
  }

  public archive(datasets: Dataset[]): Observable<void> {
    return this.archiveOrRetrieve(datasets, true);
  }

  public retrieve(
    datasets: Dataset[],
    destinationPath: string
  ): Observable<void> {
    return this.archiveOrRetrieve(datasets, false, destinationPath);
  }
}
