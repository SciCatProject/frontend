import { Component, OnInit, Input } from "@angular/core";
import { Dataset, Logbook, Proposal } from "shared/sdk/models";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"]
})
export class LogbooksDashboardComponent implements OnInit {
  @Input() dataset: Dataset;
  @Input() logbook: Logbook;
  @Input() proposal: Proposal;

  constructor() {}

  ngOnInit() {}
}
