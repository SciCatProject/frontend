import { Component, OnInit, Inject } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"]
})
export class ProposalDashboardComponent implements OnInit {
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {}
}
