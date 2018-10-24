import { Component, Inject, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { concatMap, map } from "rxjs/operators";
import { PrefillBatchAction } from "state-management/actions/datasets.actions";
import { APP_CONFIG } from "app-config.module";

import { PublishedDataApi } from "../../shared/sdk/services/custom";
import { PublishedData } from "../../shared/sdk/models";
import { Observable } from "rxjs";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"]
})
export class PublishComponent implements OnInit {
  protected datasetCount$ = this.store.pipe(
    select(getDatasetsInBatch),
    map(datasets => datasets.length)
  );

  // For simplicity, this form (including validation) is kept in component-local state.
  // Can be moved to NgRX state if necessary.

  protected form = {
    firstName: "",
    lastName: "",
    affiliation: this.appConfig.facility,
    publisher: this.appConfig.facility,
    publicationYear: String(new Date().getFullYear()),
    resourceType: "NeXus HDF5 Files",
    abstract: ""
  };

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig,
    private pdapi: PublishedDataApi
  ) {
  }

  public ngOnInit() {
    this.store.dispatch(new PrefillBatchAction());
  }

  public onPublish() {
    const doi = "new" + Math.random().toString(36).substring(7);
    console.log("register dataset");
    const batch_datasets$ = this.store.pipe(select(getDatasetsInBatch), map(datasets => {
      console.log(datasets);
      const pub = new PublishedData();
      pub.pidArray = [];
      pub.authors = [];
      for (const dataset of datasets) {
        pub.affiliation = dataset.license;
        pub.abstract = dataset.license;
        pub.authors.push(dataset.owner);
        pub.creator = dataset.owner;
        pub.dataDescription = dataset.owner;
        pub.doi = doi;
        pub.doiRegisteredSuccessfullyTime = new Date(Date.now());
        pub.numberOfFiles = 27;
        pub.pidArray.push(dataset.pid);
        pub.publicationYear = 2018;
        pub.publisher = dataset.license;
        pub.resourceType = "NeXus HDF5 files";
        pub.sizeOfArchive = 27;
        pub.thumbnail = "Test data from Scicat";
        pub.title = "Test data from Scicat";
        pub.url = "https://scicat.esss.se";
      }
      console.log(pub);
      return pub;
    }));
    if (this.formIsValid()) {
      // Publish

    } else {
      // Display error
    }
    console.log(doi);
    const register_pub$ = this.pdapi.register(doi);

    const result$ = batch_datasets$.pipe(concatMap(val => this.getPubtoCreate(val)));
    result$.subscribe();
    register_pub$.subscribe();

  }

  public register_helper(doi: string): Observable<any> {
    return this.pdapi.register(doi);
  }

  public getPubtoCreate(pub: PublishedData): Observable<any> {
    return this.pdapi.create(pub);
  }

  private formIsValid() {
    // Simplistic validation. Should probably use Angular's validation tools later on.
    const {
      firstName,
      lastName,
      affiliation,
      publisher,
      publicationYear,
      resourceType
    } = this.form;

    return (
      firstName.length !== 0 &&
      lastName.length !== 0 &&
      affiliation.length !== 0 &&
      publisher.length !== 0 &&
      publicationYear.match(/^\d{4}$/) != null &&
      resourceType.length !== 0
    );
  }
}
