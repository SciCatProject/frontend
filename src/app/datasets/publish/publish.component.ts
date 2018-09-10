import { Component, OnInit, Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { map } from "rxjs/operators";
import { PrefillBatchAction } from "state-management/actions/datasets.actions";
import { APP_CONFIG } from "app-config.module";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"]
})
export class PublishComponent implements OnInit {
  protected datasetCount$ = this.store.pipe(
    select(getDatasetsInBatch),
    map(datasets => datasets.length)
  );

  protected form = {
    firstName: "",
    lastName: "",
    affiliation: this.appConfig.facility,
    publisher: this.appConfig.facility,
    publicationYear: new Date().getFullYear()
  };

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig
  ) {}

  public ngOnInit() {
    this.store.dispatch(new PrefillBatchAction());
  }

  protected onPublish() {}
}
