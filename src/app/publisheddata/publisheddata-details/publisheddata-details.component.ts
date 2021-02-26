import { APP_CONFIG, AppConfig } from "app-config.module";
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { PublishedData } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import {
  fetchPublishedDataAction,
  registerPublishedDataAction,
} from "state-management/actions/published-data.actions";
import { Subscription } from "rxjs";
import { pluck } from "rxjs/operators";
import { getCurrentPublishedData } from "state-management/selectors/published-data.selectors";

@Component({
  selector: "publisheddata-details",
  templateUrl: "./publisheddata-details.component.html",
  styleUrls: ["./publisheddata-details.component.scss"],
})
export class PublisheddataDetailsComponent implements OnInit, OnDestroy {
  currentData$ = this.store.pipe(select(getCurrentPublishedData));

  routeSubscription: Subscription;
  landingPageUrl = "";
  doi: string;

  show = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<PublishedData>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params
      .pipe(pluck("id"))
      .subscribe((id: string) => {
        this.doi = id;
        this.store.dispatch(fetchPublishedDataAction({ id }));
      });

    this.currentData$.subscribe((data) => {
      if (data && this.appConfig.landingPage) {
        this.landingPageUrl =
          this.appConfig.landingPage + encodeURIComponent(data.doi);
      }
    });
  }

  onRegisterClick(doi: string) {
    this.store.dispatch(registerPublishedDataAction({ doi: doi }));
  }

  onEditClick() {
    const id = encodeURIComponent(this.doi);
    this.router.navigateByUrl("/publishedDatasets/" + id + "/edit");
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
