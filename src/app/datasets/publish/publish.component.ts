import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { select, Store, ActionsSubject } from "@ngrx/store";
import { first, map, tap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { prefillBatchAction } from "state-management/actions/datasets.actions";
import {
  publishDatasetAction,
  fetchPublishedDataCompleteAction,
} from "state-management/actions/published-data.actions";
import { AppConfig, APP_CONFIG } from "app-config.module";

import { PublishedDataApi } from "shared/sdk/services/custom";
import { Dataset, PublishedData } from "shared/sdk/models";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { getCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { Observable, Subscription } from "rxjs";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"],
})
export class PublishComponent implements OnInit, OnDestroy {
  private datasets$: Observable<Dataset[]> = this.store.pipe(
    select(getDatasetsInBatch)
  );
  public datasetCount$: Observable<number> = this.datasets$.pipe(
    map((datasets) => {
      if (!datasets) {
        return 0;
      }
      return datasets.length;
    })
  );

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public form: Partial<PublishedData> = {
    title: "",
    creator: [],
    publisher: this.appConfig.facility ?? "",
    resourceType: "",
    abstract: "",
    pidArray: [],
    publicationYear: parseInt(formatDate(Date.now(), "yyyy", "en_GB"), 10),
    url: "",
    dataDescription: "",
    numberOfFiles: 0,
    sizeOfArchive: 0,
    thumbnail: "",
    downloadLink: "",
    relatedPublications: [],
  };

  actionSubjectSubscription: Subscription = new Subscription();

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private publishedDataApi: PublishedDataApi,
    private actionsSubj: ActionsSubject,
    private router: Router
  ) {}

  addCreator(event: MatChipInputEvent) {
    const value = (event.value || "").trim();
    if (value) {
      this.form.creator?.push(value);
    }

    if (event.input) {
      event.input.value = "";
    }
  }

  removeCreator(creator: string) {
    const index = this.form.creator?.indexOf(creator);

    if (index && index >= 0) {
      this.form.creator?.splice(index, 1);
    }
  }

  addRelatedPublication(event: MatChipInputEvent) {
    const value = (event.value || "").trim();
    if (value) {
      this.form.relatedPublications?.push(value);
    }

    if (event.input) {
      event.input.value = "";
    }
  }

  removeRelatedPublication(relatedPublication: string) {
    const index = this.form.relatedPublications?.indexOf(relatedPublication);

    if (index && index >= 0) {
      this.form.relatedPublications?.splice(index, 1);
    }
  }

  public formIsValid(): boolean {
    return (
      this.form.title.length > 0 &&
      this.form.resourceType.length > 0 &&
      this.form.creator.length > 0 &&
      this.form.publisher.length > 0 &&
      this.form.dataDescription.length > 0 &&
      this.form.abstract.length > 0
    );
  }

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());

    this.datasets$
      .pipe(
        first(),
        tap((datasets) => {
          if (datasets) {
            const creator = datasets.map((dataset) => dataset.owner);
            const unique = creator.filter(
              (item, i) => creator.indexOf(item) === i
            );
            this.form.creator = unique;
            this.form.pidArray = datasets.map((dataset) => dataset.pid);
            let size = 0;
            datasets.forEach((dataset) => {
              size += dataset.size;
            });
            this.form.sizeOfArchive = size;
          }
        })
      )
      .subscribe();

    this.publishedDataApi
      .formPopulate(this.form.pidArray[0])
      .subscribe((result) => {
        this.form.abstract = result.abstract;
        this.form.title = result.title;
        this.form.dataDescription = result.description;
        this.form.resourceType = "raw";
        this.form.thumbnail = result.thumbnail;
      });

    this.actionSubjectSubscription = this.actionsSubj.subscribe((data) => {
      if (data.type === fetchPublishedDataCompleteAction.type) {
        this.store
          .pipe(select(getCurrentPublishedData))
          .subscribe((publishedData) => {
            if (publishedData) {
              const doi = encodeURIComponent(publishedData.doi);
              this.router.navigateByUrl("/publishedDatasets/" + doi);
            }
          })
          .unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.actionSubjectSubscription.unsubscribe();
  }

  public onPublish() {
    const publishedData = new PublishedData();
    publishedData.title = this.form.title;
    publishedData.abstract = this.form.abstract;
    publishedData.dataDescription = this.form.dataDescription;
    publishedData.resourceType = this.form.resourceType;
    publishedData.creator = this.form.creator;
    publishedData.pidArray = this.form.pidArray;
    publishedData.publisher = this.form.publisher;
    publishedData.publicationYear = this.form.publicationYear;
    publishedData.url = this.form.url;
    publishedData.thumbnail = this.form.thumbnail;
    publishedData.numberOfFiles = this.form.numberOfFiles;
    publishedData.sizeOfArchive = this.form.sizeOfArchive;
    publishedData.downloadLink = this.form.downloadLink;
    publishedData.relatedPublications = this.form.relatedPublications;

    this.store.dispatch(publishDatasetAction({ data: publishedData }));
  }
}
