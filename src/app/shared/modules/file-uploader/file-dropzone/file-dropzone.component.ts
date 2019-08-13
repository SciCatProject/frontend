import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ReadFile, ReadMode, FilePickerDirective } from "ngx-file-helpers";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Dataset, Attachment, Proposal, Sample } from "shared/sdk";
import { AddAttachment } from "state-management/actions/datasets.actions";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import { getCurrentSample } from "state-management/selectors/samples.selectors";
import { ActivatedRoute } from "@angular/router";
import { getSelectedProposal } from "state-management/selectors/proposals.selectors";

@Component({
  selector: "app-file-dropzone",
  templateUrl: "./file-dropzone.component.html",
  styleUrls: ["./file-dropzone.component.scss"]
})
export class FileDropzoneComponent implements OnInit, OnDestroy {
  dataset: Dataset;
  datasetSubscription: Subscription;

  proposal: Proposal;
  proposalSubscription: Subscription;

  sample: Sample;
  sampleSubscription: Subscription;

  currentRoute: string;
  routeSubscription: Subscription;

  newAttachment: Attachment;

  public readMode = ReadMode.dataURL;
  public picked: ReadFile;
  public status: string;
  @ViewChild(FilePickerDirective, { static: false })
  private filePicker: FilePickerDirective;

  constructor(private route: ActivatedRoute, private store: Store<any>) {}

  ngOnInit() {
    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
      });

    this.proposalSubscription = this.store
      .pipe(select(getSelectedProposal))
      .subscribe(proposal => {
        console.log("proposal", proposal);
        this.proposal = proposal;
      });

    this.routeSubscription = this.route.url.subscribe(route => {
      this.currentRoute = route[0].path;
    });

    this.sampleSubscription = this.store
      .pipe(select(getCurrentSample))
      .subscribe(sample => {
        this.sample = sample;
      });
  }

  ngOnDestroy() {
    this.datasetSubscription.unsubscribe();
    this.proposalSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.sampleSubscription.unsubscribe();
  }

  onReadStart(fileCount: number) {
    this.status = `Now reading ${fileCount} file(s)...`;
    console.log("on readstart", this.status);
  }

  onFilePicked(file: ReadFile) {
    this.picked = file;
  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    console.log("on readend", this.status);
    console.log("on readend", this.picked);
    if (fileCount > 0) {
      this.newAttachment = this.createAttachmentFromRoute();
      this.filePicker.reset();
      return this.store.dispatch(new AddAttachment(this.newAttachment));
    }
  }

  private createAttachmentFromRoute(): Attachment {
    switch (this.currentRoute) {
      case "datasets": {
        return {
          thumbnail: this.picked.content,
          caption: "",
          creationTime: new Date(),
          id: null,
          dataset: null,
          datasetId: this.dataset.pid,
          rawDatasetId: null,
          derivedDatasetId: null,
          proposal: null,
          proposalId: null,
          sample: null,
          sampleId: null
        };
      }
      case "proposals": {
        return {
          thumbnail: this.picked.content,
          caption: "",
          creationTime: new Date(),
          id: null,
          dataset: null,
          datasetId: null,
          rawDatasetId: null,
          derivedDatasetId: null,
          proposal: this.proposal,
          proposalId: this.proposal.proposalId,
          sample: null,
          sampleId: null
        };
      }
      case "samples": {
        return {
          thumbnail: this.picked.content,
          caption: "",
          creationTime: new Date(),
          id: null,
          dataset: null,
          datasetId: null,
          rawDatasetId: null,
          derivedDatasetId: null,
          proposal: null,
          proposalId: null,
          sample: this.sample,
          sampleId: this.sample.sampleId
        };
      }
      default: {
        return null;
      }
    }
  }
}
