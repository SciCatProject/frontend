import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Job, User } from "shared/sdk/models";
import * as dsa from "state-management/actions/datasets.actions";
import * as ja from "state-management/actions/jobs.actions";
import * as ua from "state-management/actions/user.actions";
import * as selectors from "state-management/selectors";
import { Subscription } from "rxjs";
import { Message, MessageType } from "state-management/models";
import { Angular5Csv } from "angular5-csv/Angular5-csv";
import { getIsAdmin } from "state-management/selectors/users.selectors";
import { APP_CONFIG, AppConfig } from "app-config.module";
import {
  getCurrentAttachments,
  getCurrentDatablocks,
  getCurrentDataset,
  getCurrentOrigDatablocks
} from "state-management/selectors/datasets.selectors";
import { pluck, take } from "rxjs/operators";

import { faAt } from "@fortawesome/free-solid-svg-icons/faAt";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons/faCalendarAlt";
import { faChessQueen } from "@fortawesome/free-solid-svg-icons/faChessQueen";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons/faFileAlt";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { faGem } from "@fortawesome/free-solid-svg-icons/faGem";
import { faGlobe } from "@fortawesome/free-solid-svg-icons/faGlobe";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons/faIdBadge";
import { faImages } from "@fortawesome/free-solid-svg-icons/faImages";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons/faUserAlt";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
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
  faUserAlt = faUserAlt;
  faUsers = faUsers;
  faDownload = faDownload;
  dataset$ = this.store.pipe(select(getCurrentDataset));
  private subscriptions: Subscription[] = [];
  private routeSubscription = this.route.params
    .pipe(pluck("id"))
    .subscribe((id: string) =>
      this.store.dispatch(new dsa.DatablocksAction(id))
    );
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
      this.store.pipe(select(selectors.jobs.submitJob)).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
          }
        },
        error => {
          console.log(error);
          msg.type = MessageType.Error;
          msg.content = "Job not Submitted";
          this.store.dispatch(new ua.ShowMessageAction(msg));
        }
      )
    );

    this.subscriptions.push(
      this.store.pipe(select(selectors.jobs.getError)).subscribe(err => {
        if (err) {
          msg.type = MessageType.Error;
          msg.content = err.message;
          this.store.dispatch(new ua.ShowMessageAction(msg));
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
        this.store.dispatch(new ja.SubmitAction(job));
      });
  }
}
