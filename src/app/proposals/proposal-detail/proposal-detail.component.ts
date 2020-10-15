import { Component, Input, Inject } from "@angular/core";
import { Proposal } from "state-management/models";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"],
})
export class ProposalDetailComponent {
  @Input() proposal: Proposal;

  show = false;

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}
}
