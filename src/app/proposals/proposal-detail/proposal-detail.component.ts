import { Component, Input } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { ProposalClass } from "shared/sdk";

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"],
})
export class ProposalDetailComponent {
  @Input() proposal: ProposalClass;

  appConfig = this.appConfigService.getConfig();

  show = false;

  constructor(public appConfigService: AppConfigService) {}
}
