import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Dataset, Attachment, Proposal, Sample } from "shared/sdk";

@Component({
  selector: "anonymous-details",
  templateUrl: "./anonymous-details.component.html",
  styleUrls: ["./anonymous-details.component.scss"]
})
export class AnonymousDetailsComponent {
  @Input() dataset: Dataset = new Dataset();
  @Input() attachments: Attachment[] | null = null;
  @Input() proposal: Proposal | null = null;
  @Input() sample: Sample | null = null;

  @Output() clickKeyword = new EventEmitter<string>();

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}

  onClickKeyword(keyword: string): void {
    this.clickKeyword.emit(keyword);
  }
}
