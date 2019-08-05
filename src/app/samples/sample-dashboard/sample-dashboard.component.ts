import { Component, OnInit, Inject } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "sample-dashboard",
  templateUrl: "./sample-dashboard.component.html",
  styleUrls: ["./sample-dashboard.component.scss"]
})
export class SampleDashboardComponent implements OnInit {
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {}
}
