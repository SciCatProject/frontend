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
        "Scicat allows users to access the metadata of raw and derived data which is taken at experiment facilities. " +
        "Scientific datasets are linked to proposals and samples. " +
        "Scientific datasets are can be linked to publications (DOI, PID). " +
        "SciCat helps keeping track of data provenance (i.e. the steps leading to the final results). " +
        "Scicat allows users to find data based on the metadata (both your own data and other peoples’ public data). " +
        "In the long term, SciCat will help to automate scientific analysis workflows.";
      this.accessText =
        "Access to the online catalogue of open data will be given to a user," +
        " providing the user registers with ESS " +
        " and accepts the terms of the ESS scientific data policy ";
      this.termsText =
        "All scientific datasets are licensed under the CC-BY-4.0 license ";
    } else if (this.appConfig["facility"] === "PSI") {
      this.aboutText =
        "Scicat allows users to access data and metadata from experiments at PSI.";
      this.accessText = "Users must comply with access policy of instruments";
      this.termsText = "Data can be used freely under the CC-BY-4.0 licence";
    } else if (this.appConfig["facility"] === "MAX IV") {
      this.aboutText =
        "Scicat allows users to access data and metadata from experiments at MAX IV.";
      this.accessText = "Users must comply with access policy of instruments";
      this.termsText = "Data can be used freely under the CC-BY-4.0 licence";
    }
  }
}
