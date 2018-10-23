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
        pub.doi = dataset.owner;
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
        pub.doi = "new" + Math.random().toString(36).substring(7);
      }
      console.log(pub);
      return pub;
    }));
    if (this.formIsValid()) {
      // Publish

    } else {
      // Display error
    }
    const published_data: PublishedData = {
      affiliation: "ESS",
      abstract: "Test abstract",
      authors: ["Addison Neutron"],
      creator: "Addison Neutron",
      dataDescription: "string",
      doi: "new" + Math.random().toString(36).substring(7),
      doiRegisteredSuccessfullyTime: new Date(Date.now()),
      numberOfFiles: 21,
      pidArray: ["2121"],
      publicationYear: 2018,
      publisher: "ESS",
      resourceType: "NeXus files",
      sizeOfArchive: 21,
      thumbnail: "string",
      title: "Test Data from SciCat 2",
      url: "https://scicat.esss.se"
    };
    published_data.doi = "new" + Math.random().toString(36).substring(7);
    console.log(published_data.doi);
    const create_pub$ = this.pdapi.create(published_data);
    const register_pub$ = this.pdapi.register(published_data.doi);

    const result$ = batch_datasets$.pipe(concatMap(val => this.getPubtoCreate(val)));
    result$.subscribe();

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
