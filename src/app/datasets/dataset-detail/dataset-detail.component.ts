import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { Attachment, Dataset, Proposal, Sample } from "shared/sdk/models";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { ENTER, COMMA, SPACE } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { SampleEditComponent } from "datasets/sample-edit/sample-edit.component";

/**
 * Component to show details for a data set, using the
 * form component
 * @export
 * @class DatasetDetailComponent
 */
@Component({
  selector: "dataset-detail",
  templateUrl: "./dataset-detail.component.html",
  styleUrls: ["./dataset-detail.component.scss"],
})
export class DatasetDetailComponent {
  @Input() dataset: Dataset;
  @Input() datasetWithout: any;
  @Input() attachments: Attachment[];
  @Input() proposal: Proposal;
  @Input() sample: Sample;
  @Input() isPI: boolean;

  @Output() clickKeyword = new EventEmitter<string>();
  @Output() addKeyword = new EventEmitter<string>();
  @Output() removeKeyword = new EventEmitter<string>();
  @Output() clickProposal = new EventEmitter<string>();
  @Output() clickSample = new EventEmitter<string>();
  @Output() saveMetadata = new EventEmitter<object>();
  @Output() sampleChange = new EventEmitter<Sample>();

  editEnabled: boolean;
  readonly separatorKeyCodes: number[] = [ENTER, COMMA, SPACE];

  show = false;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public dialog: MatDialog
  ) {}

  onClickKeyword(keyword: string): void {
    this.clickKeyword.emit(keyword);
  }

  onAddKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      const keyword = value.trim().toLowerCase();
      this.addKeyword.emit(keyword);
    }

    if (input) {
      input.value = "";
    }
  }

  onRemoveKeyword(keyword: string): void {
    this.removeKeyword.emit(keyword);
  }

  onClickProposal(proposalId: string): void {
    this.clickProposal.emit(proposalId);
  }

  onClickSample(sampleId: string): void {
    this.clickSample.emit(sampleId);
  }

  openSampleEditDialog() {
    this.dialog
      .open(SampleEditComponent, {
        width: "1000px",
        data: {
          ownerGroup: this.dataset.ownerGroup,
          sampleId: this.sample.sampleId,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const { sample } = res;
          this.sample = sample;
          this.sampleChange.emit(this.sample);
        }
      });
  }

  onSaveMetadata(metadata: object) {
    this.saveMetadata.emit(metadata);
  }
}
