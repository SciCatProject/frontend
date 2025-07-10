import { Component, OnInit } from "@angular/core";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  appConfig = this.appConfigService.getConfig();

  SciCatGitIO = "";
  SciCatGitHub = "";
  SciCatDevopsDocIO = "";
  aboutText = "";
  accessText = "";
  termsTextContinued = "";
  termsText = "";
  SNFLink = "";
  PSIDataPolicy = "";
  facility = "";

  constructor(public appConfigService: AppConfigService) {}

  ngOnInit() {
    this.SciCatDevopsDocIO =
      "https://scicatproject.github.io/documentation/Devops/Documentation/";
    this.SciCatGitIO = "https://scicatproject.github.io/";
    this.SciCatGitHub = "https://github.com/SciCatProject";
    this.facility = this.appConfig.facility ?? "";
    this.SNFLink =
      "http://www.snf.ch/en/theSNSF/research-policies/open_research_data/Pages/default.aspx#Guidelines%20and%20Regulations";
    this.PSIDataPolicy = "https://www.psi.ch/en/science/psi-data-policy";
    this.aboutText =
      "Scicat allows users to access data and metadata from experiments";
    this.accessText = "Users must comply with access policy of instruments";
    this.termsText = "Data can be used freely under the CC-BY-4.0 licence";
    if (this.facility === "ESS") {
      this.aboutText =
        "Scicat is a metadata catalogue allows users to access information about experimental results, " +
        "measured at the European Spallation Source, " +
        "(https://esss.se/). " +
        "Scientific datasets are linked to proposals and samples. " +
        "Scientific datasets are linked to publications (DOI, PID). " +
        "SciCat helps to keep track of data provenance (i.e. the steps leading to the final results). " +
        "Scicat allows users to find data based on the metadata (both your own data and other peoples’ public data). " +
        "In the long term, SciCat will help to automate scientific analysis workflows.";
      this.accessText =
        "Access to the online catalogue of open data will be given to a user," +
        " providing the user registers with ESS " +
        " and accepts the terms of the ESS scientific data policy ";
      this.termsText =
        "All scientific datasets are licensed under the CC-BY-4.0 license ";
    } else if (this.facility === "PSI") {
      this.aboutText =
        "SciCat is a metadata catalog. At PSI, SciCat works in conjunction with a PetaByte archive and remote accesss system." +
        " Together these components provide users with the ability to store, search and access their data." +
        " SciCat is an open source project in collaboration with ESS and Max IV";

      this.accessText =
        "Access to SciCat is granted to users by the Digital User Office.";
      this.termsTextContinued = "Additionally, PSI defines it's own ";
      this.termsText =
        "The Swiss National Science Foundation describes policy and guidelines on ";
    } else if (this.facility === "MAX IV") {
      this.aboutText =
        "Scicat allows users to access data and metadata from experiments at MAX IV.";
      this.accessText = "Users must comply with access policy of instruments";
      this.termsText = "Data can be used freely under the CC-BY-4.0 licence";
    }
  }
}
