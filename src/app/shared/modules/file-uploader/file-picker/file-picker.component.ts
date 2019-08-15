import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Dataset, Attachment, Proposal, Sample } from "shared/sdk/models";
import { FilePickerDirective, ReadFile, ReadMode } from "ngx-file-helpers";
import { AddAttachment as AddDatasetAttachment } from "state-management/actions/datasets.actions";
import { AddAttachmentAction as AddProposalAttachment } from "state-management/actions/proposals.actions";
import { AddAttachmentAction as AddSampleAttachment } from "state-management/actions/samples.actions";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import { ActivatedRoute } from "@angular/router";
import { getCurrentProposal } from "state-management/selectors/proposals.selectors";
import { getCurrentSample } from "state-management/selectors/samples.selectors";

@Component({
  selector: "app-file-picker",
  templateUrl: "./file-picker.component.html",
  styleUrls: ["./file-picker.component.scss"]
})
export class FilePickerComponent implements OnInit, OnDestroy {
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
    this.routeSubscription = this.route.url.subscribe(route => {
      this.currentRoute = route[0].path;
      this.addSubscription(this.currentRoute);
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  private addSubscription(route: string): void {
    switch (route) {
      case "datasets": {
        this.datasetSubscription = this.store
          .pipe(select(getCurrentDataset))
          .subscribe(dataset => {
            this.dataset = dataset;
          });
        break;
      }
      case "proposals": {
        this.proposalSubscription = this.store
          .pipe(select(getCurrentProposal))
          .subscribe(proposal => {
            this.proposal = proposal;
          });
        break;
      }
      case "samples": {
        this.sampleSubscription = this.store
          .pipe(select(getCurrentSample))
          .subscribe(sample => {
            this.sample = sample;
          });
        break;
      }
      default: {
        break;
      }
    }
  }

  private unsubscribe(): void {
    if (this.datasetSubscription) {
      this.datasetSubscription.unsubscribe();
    }
    if (this.proposalSubscription) {
      this.proposalSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.sampleSubscription) {
      this.sampleSubscription.unsubscribe();
    }
  }

  onReadStart(fileCount: number) {
    this.status = `Started reading ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    console.log("File Uploader:", this.status);
  }

  onFilePicked(file: ReadFile) {
    this.picked = file;
  }

  onReadEnd(fileCount: number) {
    this.status = `Finished reading ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    console.log("File Uploader:", this.status);
    if (fileCount > 0) {
      this.newAttachment = this.createAttachmentFromRoute();

      this.filePicker.reset();
      return this.addAttachmentFromRoute();
    }
  }

  private createAttachmentFromRoute(): Attachment {
    switch (this.currentRoute) {
      case "datasets": {
        return {
          thumbnail: this.picked.content,
          caption: this.picked.name,
          creationTime: new Date(),
          id: null,
          dataset: this.dataset,
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
          caption: this.picked.name,
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
          caption: this.picked.name,
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

  private addAttachmentFromRoute(): void {
    switch (this.currentRoute) {
      case "datasets": {
        return this.store.dispatch(
          new AddDatasetAttachment(this.newAttachment)
        );
      }
      case "proposals": {
        return this.store.dispatch(
          new AddProposalAttachment(this.newAttachment)
        );
      }
      case "samples": {
        return this.store.dispatch(new AddSampleAttachment(this.newAttachment));
      }
      default: {
        return null;
      }
    }
  }
}
