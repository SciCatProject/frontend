import { Component, Input, OnInit } from "@angular/core";
import { Proposal } from "state-management/models";

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"]
})
export class ProposalDetailComponent implements OnInit {
  @Input() proposal: Proposal;

  show = false;

  constructor() {}

  ngOnInit() {}
}
