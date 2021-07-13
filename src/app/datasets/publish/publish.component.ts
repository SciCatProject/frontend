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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

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

  form: FormGroup;
  title = new FormControl("", [Validators.required, Validators.minLength(1)]);
  creator = new FormControl([], [Validators.required, Validators.minLength(1)]);
  publisher = new FormControl(this.appConfig.facility, [
    Validators.required,
    Validators.minLength(1),
  ]);
  resourceType = new FormControl("", [
    Validators.required,
    Validators.minLength(1),
  ]);
  abstract = new FormControl("", [
    Validators.required,
    Validators.minLength(1),
  ]);
  pidArray = new FormControl([], []);
  publicationYear = new FormControl(
    parseInt(formatDate(Date.now(), "yyyy", "en_GB"), 10),
    [Validators.required]
  );
  url = new FormControl("", []);
  dataDescription = new FormControl("", [
    Validators.required,
    Validators.minLength(1),
  ]);
  numberOfFiles = new FormControl(0, []);
  sizeOfArchive = new FormControl(0, []);
  thumbnail = new FormControl("", []);
  downloadLink = new FormControl("", []);
  relatedPublications = new FormControl([], []);

  actionSubjectSubscription: Subscription = new Subscription();

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private publishedDataApi: PublishedDataApi,
    private actionsSubj: ActionsSubject,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: this.title,
      creator: this.creator,
      publisher: this.publisher,
      resourceType: this.resourceType,
      abstract: this.abstract,
      pidArray: this.pidArray,
      publicationYear: this.publicationYear,
      url: this.url,
      dataDescription: this.dataDescription,
      numberOfFiles: this.numberOfFiles,
      sizeOfArchive: this.sizeOfArchive,
      thumbnail: this.thumbnail,
      downloadLink: this.downloadLink,
      relatedPublications: this.relatedPublications,
    });
  }

  addCreator(event: MatChipInputEvent) {
    console.log({ event });
    if ((event.value || "").trim()) {
      this.form.get("creator").value.push(event.value);
    }
  }

  removeCreator(creator: string) {
    const index = this.form.get("creator")?.value.indexOf(creator);

    if (index && index > -1) {
      this.form.get("creator")?.value.splice(index, 1);
    }
  }

  addRelatedPublication(event: MatChipInputEvent) {
    if ((event.value || "").trim()) {
      this.form.get("relatedPublications").setValue(event.value);
    }

    if (event.chipInput?.inputElement) {
      event.chipInput.inputElement.value = "";
    }
  }

  removeRelatedPublication(relatedPublication: string) {
    const index = this.form
      .get("relatedPublications")
      ?.value.indexOf(relatedPublication);

    if (index && index >= 0) {
      this.form.get("relatedPublications")?.value.splice(index, 1);
    }
  }

  public formIsValid(): boolean {
    return this.form.valid;
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
            this.form.get("creator").setValue(unique);
            this.form
              .get("pidArray")
              .setValue(datasets.map((dataset) => dataset.pid));
            let size = 0;
            datasets.forEach((dataset) => {
              size += dataset.size;
            });
            this.form.get("sizeOfArchive").setValue(size);
          }
        })
      )
      .subscribe();

    this.publishedDataApi
      .formPopulate(this.form.get("pidArray")?.value[0])
      .subscribe((result) => {
        this.form.get("abstract").setValue(result.abstract);
        this.form.get("title").setValue(result.title);
        this.form.get("dataDescription").setValue(result.description);
        this.form.get("resourceType").setValue("raw");
        this.form.get("thumbnail").setValue(result.thumbnail);
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
    publishedData.title = this.form.get("title")?.value;
    publishedData.abstract = this.form.get("abstract")?.value;
    publishedData.dataDescription = this.form.get("dataDescription")?.value;
    publishedData.resourceType = this.form.get("resourceType")?.value;
    publishedData.creator = this.form.get("creator")?.value;
    publishedData.pidArray = this.form.get("pidArray")?.value;
    publishedData.publisher = this.form.get("publisher")?.value;
    publishedData.publicationYear = this.form.get("publicationYear")?.value;
    publishedData.url = this.form.get("url")?.value;
    publishedData.thumbnail = this.form.get("thumbnail")?.value;
    publishedData.numberOfFiles = this.form.get("numberOfFiles")?.value;
    publishedData.sizeOfArchive = this.form.get("sizeOfArchive")?.value;
    publishedData.downloadLink = this.form.get("downloadLink")?.value;
    publishedData.relatedPublications = this.form.get(
      "relatedPublications"
    )?.value;

    this.store.dispatch(publishDatasetAction({ data: publishedData }));
  }
}
