import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import {
  fetchDatasetAction,
  clearFacetsAction,
  addKeywordFilterAction
} from "state-management/actions/datasets.actions";
import {
  getCurrentDataset,
  getCurrentOrigDatablocks,
  getCurrentAttachments
} from "state-management/selectors/datasets.selectors";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Subscription } from "rxjs";
import { fetchSampleAction } from "state-management/actions/samples.actions";
import { fetchProposalAction } from "state-management/actions/proposals.actions";
import { getCurrentSample } from "state-management/selectors/samples.selectors";
import { getCurrentProposal } from "state-management/selectors/proposals.selectors";

@Component({
  selector: "anonymous-details-dashboard",
  templateUrl: "./anonymous-details-dashboard.component.html",
  styleUrls: ["./anonymous-details-dashboard.component.scss"]
})
export class AnonymousDetailsDashboardComponent implements OnInit, OnDestroy {
  dataset$ = this.store.pipe(select(getCurrentDataset));
  origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  attachments$ = this.store.pipe(select(getCurrentAttachments));
  proposal$ = this.store.pipe(select(getCurrentProposal));
  sample$ = this.store.pipe(select(getCurrentSample));

  datasetSubscription: Subscription;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<any>
  ) {}

  onClickKeyword(keyword: string): void {
    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.router.navigateByUrl("/anonymous/datasets");
  }

  ngOnInit() {
    const pid = this.route.snapshot.params.id;
    this.store.dispatch(fetchDatasetAction({ pid }));

    this.datasetSubscription = this.dataset$.subscribe(dataset => {
      if (dataset) {
        if ("proposalId" in dataset) {
          this.store.dispatch(
            fetchProposalAction({ proposalId: dataset["proposalId"] })
          );
        }
        if ("sampleId" in dataset) {
          this.store.dispatch(
            fetchSampleAction({ sampleId: dataset["sampleId"] })
          );
        }
      }
    });
  }

  ngOnDestroy() {
    this.datasetSubscription.unsubscribe();
  }
}
