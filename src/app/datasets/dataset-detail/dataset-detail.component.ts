import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { Attachment, Dataset } from "shared/sdk/models";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { ENTER, COMMA, SPACE } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material";

/**
 * Component to show details for a data set, using the
 * form component
 * @export
 * @class DatasetDetailComponent
 */
@Component({
  selector: "dataset-detail",
  templateUrl: "./dataset-detail.component.html",
  styleUrls: ["./dataset-detail.component.scss"]
})
export class DatasetDetailComponent {
  @Input("data") dataset: Dataset;
  @Input() datasetWithout: any;
  @Input() attachments: Attachment[];

  @Output() clickKeyword = new EventEmitter<string>();
  @Output() addKeyword = new EventEmitter<string>();
  @Output() removeKeyword = new EventEmitter<string>();
  @Output() clickProposal = new EventEmitter<string>();
  @Output() clickSample = new EventEmitter<string>();
  @Output() saveMetadata = new EventEmitter<object>();

  editEnabled: boolean;
  readonly separatorKeyCodes: number[] = [ENTER, COMMA, SPACE];

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

  onSaveMetadata(metadata: object) {
    this.saveMetadata.emit(metadata);
  }

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}
}
