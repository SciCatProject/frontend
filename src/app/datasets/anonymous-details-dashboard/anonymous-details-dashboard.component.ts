import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { fetchDatasetAction } from "state-management/actions/datasets.actions";
import {
  getCurrentDataset,
  getCurrentDatasetWithoutOrigData,
  getCurrentOrigDatablocks,
  getCurrentDatablocks,
  getCurrentAttachments
} from "state-management/selectors/datasets.selectors";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "anonymous-details-dashboard",
  templateUrl: "./anonymous-details-dashboard.component.html",
  styleUrls: ["./anonymous-details-dashboard.component.scss"]
})
export class AnonymousDetailsDashboardComponent implements OnInit {
  dataset$ = this.store.pipe(select(getCurrentDataset));
  datasetWithout$ = this.store.pipe(select(getCurrentDatasetWithoutOrigData));
  origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  datablocks$ = this.store.pipe(select(getCurrentDatablocks));
  attachments$ = this.store.pipe(select(getCurrentAttachments));

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<any>
  ) {}

  ngOnInit() {
    const pid = this.route.snapshot.params.id;
    this.store.dispatch(fetchDatasetAction({ pid }));
  }
}
