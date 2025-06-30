import { Component, OnInit, OnDestroy } from "@angular/core";
import { PublishedData } from "@scicatproject/scicat-sdk-ts-angular";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import {
  amendPublishedDataAction,
  fetchPublishedDataAction,
  fetchRelatedDatasetsAndAddToBatchAction,
  publishPublishedDataAction,
  registerPublishedDataAction,
} from "state-management/actions/published-data.actions";
import { Subscription } from "rxjs";
import { pluck } from "rxjs/operators";
import { selectCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { AppConfigService } from "app-config.service";
import { selectIsAdmin } from "state-management/selectors/user.selectors";

@Component({
  selector: "publisheddata-details",
  templateUrl: "./publisheddata-details.component.html",
  styleUrls: ["./publisheddata-details.component.scss"],
  standalone: false,
})
export class PublisheddataDetailsComponent implements OnInit, OnDestroy {
  currentData$ = this.store.select(selectCurrentPublishedData);
  isAdmin$ = this.store.select(selectIsAdmin);
  publishedData: PublishedData & { metadata?: any };
  subscriptions: Subscription[] = [];
  appConfig = this.appConfigService.getConfig();
  show = false;
  landingPageUrl = "";
  doi = "";

  constructor(
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.pipe(pluck("id")).subscribe((id: string) => {
        this.doi = id;
        this.store.dispatch(fetchPublishedDataAction({ id }));
      }),
    );

    this.subscriptions.push(
      this.currentData$.subscribe((data) => {
        if (data) {
          this.publishedData = data;

          if (this.appConfig.landingPage) {
            this.landingPageUrl =
              this.appConfig.landingPage + encodeURIComponent(data.doi);
          }
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onRegisterClick(doi: string) {
    this.store.dispatch(registerPublishedDataAction({ doi }));
  }

  onAmendClick(doi: string) {
    this.store.dispatch(amendPublishedDataAction({ doi }));
  }

  onPublishClick(doi: string) {
    this.store.dispatch(publishPublishedDataAction({ doi }));
  }

  onEditClick() {
    const id = encodeURIComponent(this.doi);
    this.router.navigateByUrl("/publishedDatasets/" + id + "/edit");
  }

  onEditDatasetList() {
    this.store.dispatch(
      fetchRelatedDatasetsAndAddToBatchAction({
        datasetPids: this.publishedData.datasetPids,
        publishedDataDoi: this.publishedData.doi,
      }),
    );
  }

  isUrl(dataDescription: string): boolean {
    return dataDescription.includes("http");
  }
}
