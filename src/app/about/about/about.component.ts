import { Component, OnInit, Inject } from "@angular/core";
import { AppConfig, APP_CONFIG } from "app-config.module";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {
  aboutText: string;
  accessText: string;
  termsText: string;
  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}

  ngOnInit() {
    this.aboutText =
      "Scicat allows users to access data and metadata from experiments";
    this.accessText = "Users must comply with access policy of instruments";
    this.termsText = "Data can be used freely under the CC-BY-4.0 licence";
    if (this.appConfig["facility"] === "ESS") {
      this.aboutText =
        "Scicat allows users to access data and metadata from neutron experiments at ESS.";
      this.accessText = "";
      this.termsText = "Data can be used freely under the CC-BY-4.0 licence";
    } else if (this.appConfig["facility"] === "PSI") {
      this.aboutText =
        "Scicat allows users to access data and metadata from experiments at PSI.";
      this.accessText = "Users must comply with access policy of instruments";
      this.termsText = "Data can be used freely under the CC-BY-4.0 licence";
    }
  }
}
