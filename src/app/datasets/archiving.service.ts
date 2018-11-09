import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";

import { Observable, combineLatest } from "rxjs";
import { first, map } from "rxjs/operators";

import { User, UserIdentity, Dataset, Job } from "state-management/models";
import { SubmitAction } from "state-management/actions/jobs.actions";
import {
  getCurrentUser,
  getTapeCopies
} from "state-management/selectors/users.selectors";
import { LoginService } from "from ../../users/login.service";

@Injectable()
export class ArchivingService {
  private currentUser$ = this.store.pipe(select(getCurrentUser));
  private tapeCopies$ = this.store.pipe(select(getTapeCopies));

  constructor(
    private store: Store<any>,
    private loginService: LoginService
  ) {}

  public archive(datasets: Dataset[]): Observable<void> {
    return this.archiveOrRetrieve(datasets, true);
  }

  public retrieve(
    datasets: Dataset[],
    destinationPath: string
  ): Observable<void> {
    return this.archiveOrRetrieve(datasets, false, destinationPath);
  }

  private createJob(
    user: User,
    datasets: Dataset[],
    archive: boolean,
    destinationPath: string,
    tapeCopies: string
  ): Job {
    const extra = archive ? {} : { destinationPath };
    const jobParams = {
      username: user.username,
      tapeCopies,
      ...extra
    };


    var ident$ = this.loginService.getUserIdent(user.id);
    ident$.subscribe(data => {
            user.email = data.profile.email;
          
    });

    const data = {
      jobParams,
      emailJobInitiator: user.email,
      creationTime: new Date(),
      datasetList: datasets.map(dataset => ({ pid: dataset.pid, files: [] })), // Revise this, files == []...? See earlier version of this method in dataset-table component for context
      type: archive ? "archive" : "retrieve"
    };

    return new Job(data);
  }

  private archiveOrRetrieve(
    datasets: Dataset[],
    archive: boolean,
    destPath?: string
  ): Observable<void> {
    return combineLatest(this.currentUser$, this.tapeCopies$).pipe(
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

        const job = this.createJob(
          user,
          datasets,
          archive,
          destPath,
          tapeCopies
        );

        this.store.dispatch(new SubmitAction(job));
      })
    );
  }
}
