import { Component, Inject, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { select, Store } from "@ngrx/store";
import { map, first, tap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { PrefillBatchAction } from "state-management/actions/datasets.actions";
import { APP_CONFIG } from "app-config.module";

import { PublishedDataApi } from "../../shared/sdk/services/custom";
import { PublishedData } from "../../shared/sdk/models";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"]
})
export class PublishComponent implements OnInit {
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  private datasets$ = this.store.pipe(select(getDatasetsInBatch));
  public datasetCount$ = this.datasets$.pipe(map(datasets => datasets.length));

  public form = {
    title: "",
    creator: "",
    authors: [],
    affiliation: this.appConfig.facility,
    publisher: this.appConfig.facility,
    resourceType: "NeXus HDF5 Files",
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

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig,
    private publishedDataApi: PublishedDataApi
  ) {}

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
  }

  public onPublish() {
    const publishedData = new PublishedData();
    publishedData.title = this.form.title;
    publishedData.creator = this.form.creator;
    publishedData.affiliation = this.form.affiliation;
    publishedData.abstract = this.form.abstract;
    publishedData.authors = this.form.authors;
    publishedData.dataDescription = this.form.description;
    publishedData.pidArray = this.form.pidArray;
    publishedData.publisher = this.form.publisher;
    publishedData.resourceType = this.form.resourceType;
    publishedData.publicationYear = this.form.publicationYear;
    publishedData.url = this.form.url;
    publishedData.thumbnail = this.form.thumbnail;
    publishedData.numberOfFiles = this.form.numberOfFiles;
    publishedData.sizeOfArchive = this.form.sizeOfArchive;

    this.publishedDataApi.create(publishedData).subscribe(result => {
      alert(JSON.stringify(result));
    });
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
