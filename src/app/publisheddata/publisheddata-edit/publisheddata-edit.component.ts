import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { select, Store, ActionsSubject } from "@ngrx/store";
import { pluck } from "rxjs/operators";

import {
  fetchPublishedDataCompleteAction,
  fetchPublishedDataAction,
  resyncPublishedDataAction,
} from "state-management/actions/published-data.actions";
import { APP_CONFIG } from "app-config.module";

import { Router, ActivatedRoute } from "@angular/router";
import { getCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { Subscription } from "rxjs";

import { ReadFile } from "ngx-file-helpers";

@Component({
  selector: "publisheddata-edit",
  templateUrl: "./publisheddata-edit.component.html",
  styleUrls: ["./publisheddata-edit.component.scss"],
})
export class PublisheddataEditComponent implements OnInit, OnDestroy {
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  currentData$ = this.store.pipe(select(getCurrentPublishedData));
  routeSubscription: Subscription;
  actionSubjectSubscription: Subscription;

  public form = {
    doi: "",
    title: "",
    creator: [],
    publisher: this.appConfig.facility,
    resourceType: "",
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
  pickedFile: any;
  attachment: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig,
    private actionsSubj: ActionsSubject
  ) {}

  addCreator(event) {
    if ((event.value || "").trim()) {
      this.form.creator.push(event.value);
    }

    if (event.input) {
      event.input.value = "";
    }
  }

  removeCreator(creator) {
    const index = this.form.creator.indexOf(creator);

    if (index >= 0) {
      this.form.creator.splice(index, 1);
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
        this.form.creator.length > 0 &&
        this.form.publisher.length > 0 &&
        this.form.dataDescription.length > 0 &&
        this.form.abstract.length > 0
      );
    } else {
      return false;
    }
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
        this.form.downloadLink = data.downloadLink || null;
        this.form.relatedPublications = data.relatedPublications || [];
        this.form.pidArray = data.pidArray;
      }
    });

    // navigate away after completion
    this.actionSubjectSubscription = this.actionsSubj.subscribe((sub) => {
      if (sub.type === fetchPublishedDataCompleteAction.type) {
        this.store
          .pipe(select(getCurrentPublishedData))
          .subscribe((publishedData) => {
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
    this.store.dispatch(
      resyncPublishedDataAction({ doi: this.form.doi, data: this.form })
    );
  }

  public onCanel() {
    const doi = encodeURIComponent(this.form.doi);
    this.router.navigateByUrl("/publishedDatasets/" + doi);
  }

  onFileUploaderFilePicked(file: ReadFile) {
    this.pickedFile = file;
  }

  public onFileUploaderReadEnd(fileCount: number) {
    if (fileCount > 0) {
      this.form.thumbnail = this.pickedFile.content;
    }
  }

  deleteAttachment(attachmentId: string) {
    this.form.thumbnail = "";
  }
}
