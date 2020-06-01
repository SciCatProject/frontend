import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { select, Store, ActionsSubject } from "@ngrx/store";
import { first, tap, pluck } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { prefillBatchAction } from "state-management/actions/datasets.actions";
import {
  publishDatasetAction,
  fetchPublishedDataCompleteAction,
  fetchPublishedDataAction,
  resyncPublishedDataAction,
} from "state-management/actions/published-data.actions";
import { APP_CONFIG } from "app-config.module";

import { PublishedDataApi } from "shared/sdk/services/custom";
import { PublishedData } from "shared/sdk/models";
import { formatDate } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { getCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { Subscription } from "rxjs";
import { getCurrentUserName } from "state-management/selectors/user.selectors";

@Component({
  selector: "publisheddata-edit",
  templateUrl: "./publisheddata-edit.component.html",
  styleUrls: ["./publisheddata-edit.component.scss"],
})
export class PublisheddataEditComponent implements OnInit, OnDestroy {
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  currentData$ = this.store.pipe(select(getCurrentPublishedData));
  current: PublishedData;
  routeSubscription: Subscription;
  actionSubjectSubscription: Subscription;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig,
    private actionsSubj: ActionsSubject
  ) {}

  ngOnInit() {
    this.currentData$.subscribe((data) => {
      this.routeSubscription = this.route.params
        .pipe(pluck("id"))
        .subscribe((id: string) => {
          if (!data) {
            this.store.dispatch(fetchPublishedDataAction({ id }));
          }
        });
      if (data) {
        this.current = data;
        this.form.abstract = data.abstract;
        this.form.creators = data.creator;
        this.form.title = data.title;
        this.form.description = data.dataDescription;
        this.form.resourceType = "raw";
        this.form.thumbnail = data.thumbnail;
        this.form.publicationYear = data.publicationYear;
        this.form.downloadLink = data.downloadLink;
        this.form.relatedPublications = data.relatedPublications;
      }
    });

    // navigate away after completion
    this.actionSubjectSubscription = this.actionsSubj.subscribe(sub => {
      if (sub.type === fetchPublishedDataCompleteAction.type) {
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
    this.routeSubscription.unsubscribe();
    this.actionSubjectSubscription.unsubscribe();
  }

  public onUpdate() {
    const publishedData = this.current;
    publishedData.title = this.form.title;
    publishedData.abstract = this.form.abstract;
    publishedData.dataDescription = this.form.description;
    publishedData.resourceType = this.form.resourceType;

    publishedData.creator = this.form.creators;
    publishedData.pidArray = this.form.pidArray;
    publishedData.publisher = this.form.publisher;
    publishedData.publicationYear = this.form.publicationYear;
    publishedData.url = this.form.url;
    publishedData.relatedPublications = this.form.relatedPublications;
    publishedData.downloadLink = this.form.downloadLink;

    this.store.dispatch(
      resyncPublishedDataAction({ doi: publishedData.doi, data: publishedData })
    );
  }
}
