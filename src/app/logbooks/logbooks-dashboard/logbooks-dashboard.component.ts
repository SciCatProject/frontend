import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Logbook, Dataset } from "shared/sdk";
import { Subscription } from "rxjs";
import { getLogbook } from "state-management/selectors/logbooks.selector";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import { FetchLogbookAction } from "state-management/actions/logbooks.actions";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"]
})
export class LogbooksDashboardComponent implements OnInit, OnDestroy {
  logbookName: string;

  logbook: Logbook;
  logbookSubscription: Subscription;

  dataset: Dataset;
  datasetSubscription: Subscription;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private store: Store<Logbook>
  ) {
    iconRegistry.addSvgIcon(
      "riot-im",
      sanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/riot-im-logo-black-text.svg"
      )
    );
  }

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });
    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
      });
    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
      });

    this.route.params.subscribe(params => {
      if (params.hasOwnProperty("name")) {
        this.logbookName = params["name"];
      } else {
        if (this.dataset.hasOwnProperty("proposalId")) {
          this.logbookName = this.dataset.proposalId;
        }
      }
    });

    this.store.dispatch(new FetchLogbookAction(this.logbookName));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.datasetSubscription.unsubscribe();
  }
}
