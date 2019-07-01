import { ActivatedRoute } from "@angular/router";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  DatablocksAction,
  DeleteAttachment
} from "state-management/actions/datasets.actions";
import { Job, User } from "shared/sdk/models";
import { select, Store } from "@ngrx/store";
import { SubmitAction } from "state-management/actions/jobs.actions";
import { ShowMessageAction } from "state-management/actions/user.actions";
import {
  getError,
  submitJob
} from "../../state-management/selectors/jobs.selectors";
import { Subscription, of } from "rxjs";
import { Message, MessageType } from "state-management/models";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import { getIsAdmin } from "state-management/selectors/users.selectors";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { pluck, take, mergeMap } from "rxjs/operators";
import { Router } from "@angular/router";
import {
  getCurrentAttachments,
  getCurrentDatablocks,
  getCurrentDataset,
  getCurrentOrigDatablocks,
  getCurrentDatasetWithoutOrigData
} from "state-management/selectors/datasets.selectors";

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
  dataset$ = this.store.pipe(select(getCurrentDataset));
  datasetwithout$ = this.store.pipe(select(getCurrentDatasetWithoutOrigData));
  sciMet: Object;
  public withUnits$;
  public dates$;
  public noUnits$;
  public dates = {
    start_time: "2011-10-05T14:48:00.000Z",
    end_time: "2011-10-05T14:48:00.000Z"
  };
  public objectKeys = Object.keys;
  public objs;
  private subscriptions: Subscription[] = [];
  private routeSubscription = this.route.params
    .pipe(pluck("id"))
    .subscribe((id: string) => this.store.dispatch(new DatablocksAction(id)));
  public origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  public datablocks$ = this.store.pipe(select(getCurrentDatablocks));
  public attachments$ = this.store.pipe(select(getCurrentAttachments));
  public isAdmin$ = this.store.pipe(select(getIsAdmin));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  convertUnits(scimeta) {
    const units = {};
    for (const key in scimeta) {
      if (scimeta[key].hasOwnProperty("u")) {
        units[key] = scimeta[key];
      }
    }
    return units;
  }

  getDates(scimeta) {
    const dates = [];
    for (const key in scimeta) {
      if (scimeta[key] instanceof Date) {
        const arr = { name: key, value: scimeta[key] };
        dates.push(arr);
      }
    }
    return dates;
  }

  getStrings(scimeta) {
    const strings = [];
    for (const key in scimeta) {
      if (typeof scimeta[key] === "string") {
        const arr = { name: key, value: scimeta[key] };
        strings.push(arr);
      }
    }
    return strings;
  }

  getObjects(scimeta) {
    const objects = [];
    for (const key in scimeta) {
      if (scimeta[key] instanceof Object) {
        objects.push(scimeta[key]);
      }
    }
    return objects;
  }

  ngOnInit() {
    const msg = new Message();
    this.withUnits$ = this.dataset$.pipe(
      pluck("scientificMetadata"),
      mergeMap(val => of(this.convertUnits(val)))
    );
    this.noUnits$ = this.dataset$.pipe(
      pluck("scientificMetadata"),
      mergeMap(val => of(this.getStrings(val)))
    );
    this.dates$ = this.dataset$.pipe(
      pluck("scientificMetadata"),
      mergeMap(val => of(this.getDates(val)))
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
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
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
    if (!confirm("Reset datablocks?")) {
      return null;
    }
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

  delete(dataset_id, dataset_attachment_id) {
    console.log(
      "fire action to delete dataset attachment id ",
      dataset_attachment_id,
      dataset_id
    );
    this.store.dispatch(
      new DeleteAttachment(dataset_id, dataset_attachment_id)
    );
  }

  onClickProp(proposalId: string): void {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }

  onClickSample(proposalId: string): void {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/samples/" + id);
  }
}
