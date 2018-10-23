import { Component, Inject, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { map } from "rxjs/operators";
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
    this.store.pipe(select(getDatasetsInBatch), map(datasets => {
      console.log(datasets);
    }));
    if (this.formIsValid()) {
      // Publish

    } else {
      // Display error
    }
    const published_data: PublishedData = {
      affiliation: "ESS",
      doi: "newdoi" + Math.random().toString(36).substring(7),
      creator: "Addison Neutron",
      publisher: "ESS",
      publicationYear: 2018,
      title: "Test Data from SciCat",
      url: "https://scicat.esss.se",
      abstract: "Test abstract",
      dataDescription: "string",
      thumbnail: "string",
      resourceType: "NeXus files",
      numberOfFiles: 21,
      sizeOfArchive: 21,
      pidArray: ["2121"],
      authors: ["Addison Neutron"],
      doiRegisteredSuccessfullyTime: new Date(Date.now())
    };
    this.pdapi.create(published_data).subscribe();
    this.pdapi.register(published_data.doi).subscribe();

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
