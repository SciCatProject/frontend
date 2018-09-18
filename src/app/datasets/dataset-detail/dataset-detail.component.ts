import { ActivatedRoute } from "@angular/router";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { DatablocksAction } from "state-management/actions/datasets.actions";
import { Job, User } from "shared/sdk/models";
import { select, Store } from "@ngrx/store";
import { SubmitAction } from "state-management/actions/jobs.actions";
import { ShowMessageAction } from "state-management/actions/user.actions";
import { getError } from "../../state-management/selectors/jobs.selectors";
import { submitJob } from "../../state-management/selectors/jobs.selectors";
import { Subscription } from "rxjs";
import { Message, MessageType } from "state-management/models";
import { Angular5Csv } from "angular5-csv/Angular5-csv";
import { getIsAdmin } from "state-management/selectors/users.selectors";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { pluck, take } from "rxjs/operators";
import {
  getCurrentAttachments,
  getCurrentDatablocks,
  getCurrentDataset,
  getCurrentOrigDatablocks
} from "state-management/selectors/datasets.selectors";

import {
  faAt,
  faCalendarAlt,
  faCertificate,
  faChessQueen,
  faCoins,
  faDownload,
  faFileAlt,
  faFolder,
  faGem,
  faGlobe,
  faIdBadge,
  faImages,
  faUpload,
  faUserAlt,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { ArchivingService } from "../archiving.service";

/**
 * Component to show details for a data set, using the
 * form component
 * @export
 * @class DatasetDetailComponent
 * @implements {OnInit}
 */
@Component({
  selector: "dataset-detail",
  templateUrl: "./dataset-detail.component.html",
  styleUrls: ["./dataset-detail.component.scss"]
})
export class DatasetDetailComponent implements OnInit, OnDestroy {
  faAt = faAt;
  faIdBadge = faIdBadge;
  faFolder = faFolder;
  faCoins = faCoins;
  faChessQueen = faChessQueen;
  faCalendarAlt = faCalendarAlt;
  faFileAlt = faFileAlt;
  faImages = faImages;
  faGem = faGem;
  faGlobe = faGlobe;
  faCertificate = faCertificate;
  faUserAlt = faUserAlt;
  faUsers = faUsers;
  faUpload = faUpload;
  faDownload = faDownload;
  dataset$ = this.store.pipe(select(getCurrentDataset));
  private subscriptions: Subscription[] = [];
  private routeSubscription = this.route.params
    .pipe(pluck("id"))
    .subscribe((id: string) => this.store.dispatch(new DatablocksAction(id)));
  private origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  private datablocks$ = this.store.pipe(select(getCurrentDatablocks));
  private attachments$ = this.store.pipe(select(getCurrentAttachments));
  private isAdmin$ = this.store.pipe(select(getIsAdmin));

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {
    const msg = new Message();
    this.subscriptions.push(
      this.store.pipe(select(submitJob)).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
          }
        },
        error => {
          console.log(error);
          msg.type = MessageType.Error;
          msg.content = "Job not Submitted";
          this.store.dispatch(new ShowMessageAction(msg));
        }
      )
    );

    this.subscriptions.push(
      this.store.pipe(select(getError)).subscribe(err => {
        if (err) {
          msg.type = MessageType.Error;
          msg.content = err.message;
          this.store.dispatch(new ShowMessageAction(msg));
        }
      })
    );
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onExportClick() {
    this.dataset$.pipe(take(1)).subscribe(ds => {
      const options = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalseparator: ".",
        showLabels: true,
        showTitle: false,
        useBom: true,
        headers: Object.keys(ds)
      };
      const newDs = {};
      for (const key of Object.keys(ds)) {
        newDs[key] = JSON.stringify(ds[key]);
      }
      const ts = new Angular5Csv([newDs], "Dataset_" + ds.pid, options);
    });
  }

  resetDataset(dataset) {
    this.store
      .pipe(
        select(state => state.root.user.currentUser),
        take(1)
      )
      .subscribe((user: User) => {
        const job = new Job();
        job.emailJobInitiator = user.email;
        job.jobParams = {};
        job.jobParams["username"] = user.username;
        job.creationTime = new Date();
        job.type = "reset";
        const fileObj = {};
        const fileList = [];
        fileObj["pid"] = dataset["pid"];
        if (dataset["datablocks"]) {
          dataset["datablocks"].map(d => {
            fileList.push(d["archiveId"]);
          });
        }
        fileObj["files"] = fileList;
        job.datasetList = [fileObj];
        console.log(job);
        this.store.dispatch(new SubmitAction(job));
      });
  }
}
