import {
  Component,
  Inject,
  OnInit,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { Attachment, Dataset } from "shared/sdk/models";
import { APP_CONFIG, AppConfig } from "app-config.module";

/**
 * Component to show details for a data set, using the
 * form component
 * @export
 * @class DatasetDetailComponent
 * @implements {OnInit}
 */
@Component({
  selector: "dataset-detail",
  templateUrl: "./dataset-detail.component.html",
  styleUrls: ["./dataset-detail.component.scss"]
})
export class DatasetDetailComponent implements OnInit {
  @Input() dataset: Dataset;
  @Input() datasetWithout: any;
  @Input() attachments: Attachment[];

  @Output() clickKeyword = new EventEmitter<string>();
  @Output() clickProposal = new EventEmitter<string>();
  @Output() clickSample = new EventEmitter<string>();

  onClickKeyword(keyword: string): void {
    this.clickKeyword.emit(keyword);
  }

  onClickProposal(proposalId: string): void {
    this.clickProposal.emit(proposalId);
  }

  onClickSample(sampleId: string): void {
    this.clickSample.emit(sampleId);
  }

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}

  ngOnInit() {}
}
