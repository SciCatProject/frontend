import { Component, OnInit } from "@angular/core";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
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
      this.appConfig.aboutText || 
      "Scicat allows users to access data and metadata from experiments";
    this.accessText = 
      this.appConfig.accessText || 
      "Users must comply with access policy of instruments";
    this.termsText = 
      this.appConfig.termsText || 
      "Data can be used freely under the CC-BY-4.0 license";
    this.termsTextContinued = 
      this.appConfig.termsTextContinued || 
      "";
  }
}
