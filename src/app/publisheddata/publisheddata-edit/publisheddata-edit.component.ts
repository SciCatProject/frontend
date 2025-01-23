import { Component, OnDestroy, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Store } from "@ngrx/store";
import {
  fetchPublishedDataAction,
  resyncPublishedDataAction,
} from "state-management/actions/published-data.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { selectCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import { MatChipInputEvent } from "@angular/material/chips";
import {
  Attachment,
  PublishedData,
} from "@scicatproject/scicat-sdk-ts-angular";
import { PickedFile } from "shared/modules/file-uploader/file-uploader.component";
import { tap } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: "publisheddata-edit",
  templateUrl: "./publisheddata-edit.component.html",
  styleUrls: ["./publisheddata-edit.component.scss"],
})
export class PublisheddataEditComponent implements OnInit, OnDestroy {
  routeSubscription = new Subscription();
  publishedData$: Observable<PublishedData> = new Observable();
  attachments: Attachment[] = [];
  form: FormGroup = this.formBuilder.group({
    doi: [""],
    title: ["", Validators.required],
    creator: [[""], Validators.minLength(1)],
    publisher: ["", Validators.required],
    resourceType: ["", Validators.required],
    abstract: ["", Validators.required],
    pidArray: [[""], Validators.minLength(1)],
    publicationYear: [0, Validators.required],
    url: [""],
    dataDescription: ["", Validators.required],
    thumbnail: [""],
    numberOfFiles: [0],
    sizeOfArchive: [0],
    downloadLink: [""],
    relatedPublications: [[]],
  });

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {}

  addCreator(event: MatChipInputEvent) {
    const value = (event.value || "").trim();
    if (value) {
      this.creator!.value.push(value);
    }

    if (event.chipInput && event.chipInput.inputElement.value) {
      event.chipInput.inputElement.value = "";
    }
  }

  removeCreator(index: number) {
    if (index >= 0) {
      this.creator!.value.splice(index, 1);
    }
  }

  addRelatedPublication(event: MatChipInputEvent) {
    const value = (event.value || "").trim();
    if (value) {
      this.relatedPublications!.value.push(value);
    }

    if (event.chipInput && event.chipInput.inputElement.value) {
      event.chipInput.inputElement.value = "";
    }
  }

  removeRelatedPublication(index: number) {
    if (index >= 0) {
      this.relatedPublications!.value.splice(index, 1);
    }
  }

  public onUpdate() {
    if (this.form.valid) {
      const doi = this.form.get("doi")!.value;
      if (doi) {
        this.store.dispatch(
          resyncPublishedDataAction({ doi, data: this.form.value }),
        );
      }
    }
  }

  public onCancel() {
    const doi = this.form.get("doi")!.value;
    if (doi) {
      const encodedDoi = encodeURIComponent(doi);
      this.router.navigateByUrl("/publishedDatasets/" + encodedDoi);
    }
  }

  onFileUploaderFilePicked(file: PickedFile) {
    this.form.get("thumbnail")!.setValue(file.content);
  }

  deleteAttachment(attachmentId: string) {
    this.form.get("thumbnail")!.setValue("");
  }

  get creator() {
    return this.form.get("creator");
  }

  get relatedPublications() {
    return this.form.get("relatedPublications");
  }

  get thumbnail() {
    return this.form.get("thumbail");
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(({ id }) =>
      this.store.dispatch(fetchPublishedDataAction({ id })),
    );

    this.publishedData$ = this.store
      .select(selectCurrentPublishedData)
      .pipe(tap((publishedData) => this.form.patchValue(publishedData)));
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
