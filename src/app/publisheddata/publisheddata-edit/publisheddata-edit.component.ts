import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { Store, ActionsSubject } from "@ngrx/store";
import { pluck } from "rxjs/operators";

import {
  fetchPublishedDataCompleteAction,
  fetchPublishedDataAction,
  resyncPublishedDataAction,
} from "state-management/actions/published-data.actions";
import { AppConfig, APP_CONFIG } from "app-config.module";

import { Router, ActivatedRoute } from "@angular/router";
import { selectCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { Subscription } from "rxjs";

import { MatChipInputEvent } from "@angular/material/chips";
import { PublishedData } from "shared/sdk";
import { PickedFile } from "shared/modules/file-uploader/file-uploader.component";

@Component({
  selector: "publisheddata-edit",
  templateUrl: "./publisheddata-edit.component.html",
  styleUrls: ["./publisheddata-edit.component.scss"],
})
export class PublisheddataEditComponent implements OnInit, OnDestroy {
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  currentData$ = this.store.select(selectCurrentPublishedData);
  routeSubscription: Subscription = new Subscription();
  actionSubjectSubscription: Subscription = new Subscription();

  public form: Partial<PublishedData> = {
    doi: "",
    title: "",
    creator: [],
    publisher: this.appConfig.facility ?? "",
    resourceType: "",
    abstract: "",
    pidArray: [],
    publicationYear: undefined,
    url: "",
    dataDescription: "",
    thumbnail: "",
    numberOfFiles: undefined,
    sizeOfArchive: undefined,
    downloadLink: "",
    relatedPublications: [],
  };
  attachment: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private actionsSubj: ActionsSubject
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

  public formIsValid() {
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
    this.currentData$.subscribe((data) => {
      this.routeSubscription = this.route.params
        .pipe(pluck("id"))
        .subscribe((id: string) => {
          if (!data) {
            this.store.dispatch(fetchPublishedDataAction({ id }));
          }
        });
      if (data) {
        this.form.doi = data.doi;
        this.form.abstract = data.abstract;
        this.form.dataDescription = data.dataDescription;
        this.form.creator = data.creator;
        this.form.title = data.title;
        this.form.resourceType = data.resourceType;
        this.form.thumbnail = data.thumbnail;
        this.form.publicationYear = data.publicationYear;
        this.form.downloadLink = data.downloadLink || undefined;
        this.form.relatedPublications = data.relatedPublications || [];
        this.form.pidArray = data.pidArray;
      }
    });

    // navigate away after completion
    this.actionSubjectSubscription = this.actionsSubj.subscribe((sub) => {
      if (sub.type === fetchPublishedDataCompleteAction.type) {
        this.store
          .select(selectCurrentPublishedData)
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
    this.routeSubscription.unsubscribe();
    this.actionSubjectSubscription.unsubscribe();
  }

  public onUpdate() {
    const doi = this.form.doi;
    if (doi) {
      this.store.dispatch(resyncPublishedDataAction({ doi, data: this.form }));
    }
  }

  public onCancel() {
    if (this.form.doi) {
      const doi = encodeURIComponent(this.form.doi);
      this.router.navigateByUrl("/publishedDatasets/" + doi);
    }
  }

  onFileUploaderFilePicked(file: PickedFile) {
    this.form.thumbnail = file.content;
  }

  deleteAttachment(attachmentId: string) {
    this.form.thumbnail = "";
  }
}
