import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Dataset, Attachment, Proposal, Sample } from "shared/sdk";

@Component({
  selector: "anonymous-details",
  templateUrl: "./anonymous-details.component.html",
  styleUrls: ["./anonymous-details.component.scss"]
})
export class AnonymousDetailsComponent {
  @Input() dataset: Dataset | undefined;
  @Input() attachments: Attachment[] | null | undefined;
  @Input() proposal: Proposal | null | undefined;
  @Input() sample: Sample | null | undefined;

  @Output() clickKeyword = new EventEmitter<string>();

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}

  onClickKeyword(keyword: string): void {
    this.clickKeyword.emit(keyword);
  }
}
