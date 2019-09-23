import { Component, Inject, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { select, Store } from "@ngrx/store";
import { map, first, tap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { PrefillBatchAction } from "state-management/actions/datasets.actions";
import {
  UpsertWaitPublishedData,
  PublishedDataActionTypes,
  CustomAction
} from "state-management/actions/published-data.actions";
import { APP_CONFIG } from "app-config.module";

import { PublishedDataApi } from "../../shared/sdk/services/custom";
import { PublishedData } from "../../shared/sdk/models";
import { formatDate } from "@angular/common";
import { MessageType } from "state-management/models";
import { ShowMessageAction } from "state-management/actions/user.actions";
import { Router } from "@angular/router";
import { ActionsSubject } from "@ngrx/store";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"]
})
export class PublishComponent implements OnInit {
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  private datasets$ = this.store.pipe(select(getDatasetsInBatch));
  public datasetCount$ = this.datasets$.pipe(map(datasets => datasets.length));
  today: number = Date.now();

  public form = {
    title: "",
    creator: "",
    authors: [],
    affiliation: this.appConfig.facility,
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
    sizeOfArchive: null
  };

  public formData = null;
  subsc = null;

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig,
    private publishedDataApi: PublishedDataApi,
    private actionsSubj: ActionsSubject,
    private router: Router,
  ) {
    this.subsc = this.actionsSubj.subscribe(data => {
      if (data.type === PublishedDataActionTypes.AddPublishedData) {
        this.store.dispatch(
          new ShowMessageAction({
            type: MessageType.Success,
            content: "Publication Successful" ,
            duration: 5000
          })
        );
        const pub = data as CustomAction;
        const doi = encodeURIComponent(pub.payload.publishedData.doi);
        this.router.navigateByUrl("/publishedDataset/" + doi);
      } else if (
        data.type === PublishedDataActionTypes.FailedPublishedDataAction
      ) {
        this.store.dispatch(
          new ShowMessageAction({
            type: MessageType.Error,
            content: "Publication Failed",
            duration: 5000
          })
        );
      }
    });
  }

  public ngOnInit() {
    this.store.dispatch(new PrefillBatchAction());

    this.datasets$
      .pipe(
        first(),
        tap(datasets => {
          const authors = datasets.map(dataset => dataset.owner);
          const unique = authors.filter(
            (author, i) => authors.indexOf(author) === i
          );
          this.form.authors = unique;
          this.form.creator = unique.join(",");
          this.form.pidArray = datasets.map(dataset => dataset.pid);
        })
      )
      .subscribe();

    this.publishedDataApi
      .formPopulate(this.form.pidArray[0])
      .subscribe(result => {
        this.form.abstract = result.abstract;
        this.form.title = result.title;
        this.form.description = result.description;
        this.form.resourceType = result.resourceType;
      });
  }

  public onPublish() {
    const publishedData = new PublishedData();
    publishedData.title = this.form.title;
    publishedData.abstract = this.form.abstract;
    publishedData.dataDescription = this.form.description;
    publishedData.resourceType = this.form.resourceType;

    publishedData.creator = this.form.creator;
    publishedData.affiliation = this.form.affiliation;
    publishedData.authors = this.form.authors;
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

    this.store.dispatch(new UpsertWaitPublishedData({ publishedData }));
  }

  addAuthor(event) {
    this.form.authors.push(event.value);
    event.input.value = "";
  }

  removeAuthor(author) {
    const index = this.form.authors.indexOf(author);
    this.form.authors.splice(index, 1);
  }

  public formIsValid() {
    return (
      this.form.title.length > 0 &&
      this.form.authors.length > 0 &&
      this.form.affiliation.length > 0 &&
      this.form.publisher.length > 0 &&
      this.form.resourceType.length > 0 &&
      this.form.description.length > 0 &&
      this.form.abstract.length > 0
    );
  }
}
