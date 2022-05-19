import { Component, Input } from "@angular/core";
import { Proposal } from "state-management/models";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"],
})
export class ProposalDetailComponent {
  @Input() proposal: Proposal = new Proposal();

  appConfig = this.appConfigService.getConfig();

  show = false;

  constructor(public appConfigService: AppConfigService) {}
}
