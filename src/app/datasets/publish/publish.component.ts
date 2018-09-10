import { Component, OnInit, Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { map } from "rxjs/operators";
import { PrefillBatchAction } from "state-management/actions/datasets.actions";
import { APP_CONFIG } from "app-config.module";

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

  // For simpliciy, this form (including valiation) is kept in component-local state.
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
    @Inject(APP_CONFIG) private appConfig
  ) {}

  public ngOnInit() {
    this.store.dispatch(new PrefillBatchAction());
  }

  protected onPublish() {
    if (this.formIsValid()) {
      // Publish
    } else {
      // Display error
    }
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
