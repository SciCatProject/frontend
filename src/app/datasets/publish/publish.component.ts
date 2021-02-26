import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { select, Store, ActionsSubject } from "@ngrx/store";
import { first, tap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { prefillBatchAction } from "state-management/actions/datasets.actions";
import {
  publishDatasetAction,
  fetchPublishedDataCompleteAction
} from "state-management/actions/published-data.actions";
import { APP_CONFIG } from "app-config.module";

import { PublishedDataApi } from "shared/sdk/services/custom";
import { PublishedData } from "shared/sdk/models";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { getCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { Subscription } from "rxjs";
import { getCurrentUserName } from "state-management/selectors/user.selectors";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"]
})
export class PublishComponent implements OnInit, OnDestroy {
  private datasets$ = this.store.pipe(select(getDatasetsInBatch));
  private userName$ = this.store.pipe(select(getCurrentUserName));
  private countSubscription: Subscription;

  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public datasetCount: number;
  today: number = Date.now();

  public form = {
    title: "",
    creators: [],
    publisher: this.appConfig.facility,
    resourceType: "",
    description: "",
    abstract: "",
    pidArray: [],
    publicationYear: null,
    url: "",
    dataDescription: "",
    thumbnail: "",
    numberOfFiles: null,
    sizeOfArchive: null,
    downloadLink: "",
    relatedPublications: [],
  };

  public formData = null;
  actionSubjectSubscription: Subscription;

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig,
    private publishedDataApi: PublishedDataApi,
    private actionsSubj: ActionsSubject,
    private router: Router
  ) {}

  addCreator(event) {
    if ((event.value || "").trim()) {
      this.form.creators.push(event.value);
    }

    if (event.input) {
      event.input.value = "";
    }
  }

  removeCreator(creator) {
    const index = this.form.creators.indexOf(creator);

    if (index >= 0) {
      this.form.creators.splice(index, 1);
    }
  }

  addRelatedPublication(event) {
    if ((event.value || "").trim()) {
      this.form.relatedPublications.push(event.value);
    }

    if (event.input) {
      event.input.value = "";
    }
  }

  removeRelatedPublication(relatedPublication) {
    const index = this.form.relatedPublications.indexOf(relatedPublication);

    if (index >= 0) {
      this.form.relatedPublications.splice(index, 1);
    }
  }


  public formIsValid() {
    if (!Object.values(this.form).includes(undefined)) {
      return (
        this.form.title.length > 0 &&
        this.form.resourceType.length > 0 &&
        this.form.creators.length > 0 &&
        this.form.publisher.length > 0 &&
        this.form.description.length > 0 &&
        this.form.abstract.length > 0
      );
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());

    this.datasets$
      .pipe(
        first(),
        tap(datasets => {
          if (datasets) {
            const creator = datasets.map(dataset => dataset.owner);
            const unique = creator.filter(
              (item, i) => creator.indexOf(item) === i
            );
            this.form.creators = unique;
            this.form.pidArray = datasets.map(dataset => dataset.pid);
          }
        })
      )
      .subscribe();

    this.countSubscription = this.datasets$.subscribe(datasets => {
      if (datasets) {
        this.datasetCount = datasets.length;
      }
    });

    this.publishedDataApi
      .formPopulate(this.form.pidArray[0])
      .subscribe(result => {
        this.form.abstract = result.abstract;
        this.form.title = result.title;
        this.form.description = result.description;
        this.form.resourceType = "raw";
        this.form.thumbnail = result.thumbnail;
      });

    this.actionSubjectSubscription = this.actionsSubj.subscribe(data => {
      if (data.type === fetchPublishedDataCompleteAction.type) {
        this.store
          .pipe(select(getCurrentPublishedData))
          .subscribe(publishedData => {
            const doi = encodeURIComponent(publishedData.doi);
            this.router.navigateByUrl("/publishedDatasets/" + doi);
          })
          .unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.actionSubjectSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
  }

  public onPublish() {
    const publishedData = new PublishedData();
    publishedData.title = this.form.title;
    publishedData.abstract = this.form.abstract;
    publishedData.dataDescription = this.form.description;
    publishedData.resourceType = this.form.resourceType;

    publishedData.creator = this.form.creators;
    publishedData.pidArray = this.form.pidArray;
    publishedData.publisher = this.form.publisher;
    publishedData.publicationYear = parseInt(
      formatDate(this.today, "yyyy", "en_GB"),
      10
    );
    publishedData.url = this.form.url;
    publishedData.thumbnail = this.form.thumbnail;
    publishedData.numberOfFiles = this.form.numberOfFiles;
    publishedData.sizeOfArchive = this.form.sizeOfArchive;
    publishedData.downloadLink = this.form.downloadLink;
    publishedData.relatedPublications = this.form.relatedPublications;

    this.store.dispatch(publishDatasetAction({ data: publishedData }));
  }
}
