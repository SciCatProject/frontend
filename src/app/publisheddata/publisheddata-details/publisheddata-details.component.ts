import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  PublishedData,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import {
  deletePublishedDataAction,
  fetchPublishedDataAction,
  fetchRelatedDatasetsAndAddToBatchAction,
} from "state-management/actions/published-data.actions";
import { Subscription, combineLatest } from "rxjs";
import { pluck } from "rxjs/operators";
import { selectCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { AppConfigService } from "app-config.service";
import {
  selectCurrentUser,
  selectIsAdmin,
} from "state-management/selectors/user.selectors";
import {
  ActionItems,
  ActionButtonStyle,
} from "shared/modules/configurable-actions/configurable-action.interfaces";

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
  user: ReturnedUserDto | undefined;
  landingPageUrl = "";
  doi = "";

  actionItems: ActionItems = {
    datasets: [],
    publisheddata: [],
  };
  actionButtonsStyle: ActionButtonStyle = { raised: true, color: "accent" };

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
      combineLatest([
        this.store.select(selectCurrentUser),
        this.currentData$,
      ]).subscribe(([user, data]) => {
        this.user = user;
        if (data) {
          this.publishedData = data;
          this.actionItems = {
            datasets: [],
            publisheddata: [data],
            encodedDoi: encodeURIComponent(data.doi),
            user,
          };

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

  onActionFinished(event: { success: boolean }) {
    if (event.success) {
      this.store.dispatch(fetchPublishedDataAction({ id: this.doi }));
    }
  }

  onDeleteClick(doi: string) {
    if (confirm("Are you sure you want to delete this published data?")) {
      this.store.dispatch(deletePublishedDataAction({ doi }));
    }
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
