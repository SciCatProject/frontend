import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Dataset, UserApi } from "shared/sdk";
import {
  getCurrentDataset,
  getCurrentDatasetWithoutOrigData,
  getCurrentOrigDatablocks,
  getCurrentDatablocks,
  getCurrentAttachments,
  getViewPublicMode
} from "state-management/selectors/datasets.selectors";
import { getIsAdmin } from "state-management/selectors/users.selectors";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { pluck } from "rxjs/operators";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Message, MessageType } from "state-management/models";
import { submitJob, getError } from "state-management/selectors/jobs.selectors";
import { ShowMessageAction } from "state-management/actions/user.actions";
import { DatablocksAction } from "state-management/actions/datasets.actions";

@Component({
  selector: "dataset-details-dashboard",
  templateUrl: "./dataset-details-dashboard.component.html",
  styleUrls: ["./dataset-details-dashboard.component.scss"]
})
export class DatasetDetailsDashboardComponent implements OnInit, OnDestroy {
  datasetWithout$ = this.store.pipe(select(getCurrentDatasetWithoutOrigData));
  origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  datablocks$ = this.store.pipe(select(getCurrentDatablocks));
  attachments$ = this.store.pipe(select(getCurrentAttachments));
  isAdmin$ = this.store.pipe(select(getIsAdmin));
  jwt$: Observable<any>;

  dataset: Dataset;
  datasetPid: string;
  viewPublic: boolean;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<Dataset>,
    private userApi: UserApi
  ) {}

  ngOnInit() {
    const message = new Message();

    this.subscriptions.push(
      this.route.params.pipe(pluck("id")).subscribe((id: string) => {
        this.datasetPid = id;
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getCurrentDataset)).subscribe(dataset => {
        this.dataset = dataset;
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(submitJob)).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
          }
        },
        error => {
          console.log(error);
          message.type = MessageType.Error;
          message.content = "Job not Submitted";
          this.store.dispatch(new ShowMessageAction(message));
        }
      )
    );

    this.subscriptions.push(
      this.store.pipe(select(getError)).subscribe(err => {
        if (err) {
          message.type = MessageType.Error;
          message.content = err.message;
          this.store.dispatch(new ShowMessageAction(message));
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getViewPublicMode)).subscribe(viewPublic => {
        this.viewPublic = viewPublic;
      })
    );

    if (this.viewPublic) {
      this.store.dispatch(
        new DatablocksAction(this.datasetPid, { isPublished: this.viewPublic })
      );
    } else {
      this.store.dispatch(new DatablocksAction(this.datasetPid));
    }

    this.jwt$ = this.userApi.jwt();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
