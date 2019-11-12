import { Component, Input } from "@angular/core";
import { Proposal } from "state-management/models";

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"]
})
export class ProposalDetailComponent {
  @Input() proposal: Proposal;

  show = false;
}
