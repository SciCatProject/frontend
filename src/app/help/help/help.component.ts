import { Component, OnInit } from "@angular/core";
import { AppConfigService, HelpMessages } from "app-config.service";

@Component({
  selector: "help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"],
})
export class HelpComponent implements OnInit {
  appConfig = this.appConfigService.getConfig();
  facility: string | null = null;
  ingestManual: string | null = null;
  gettingStarted: string | null = null;
  shoppingCartEnabled = false;
  helpMessages: HelpMessages;
  docText = "";
  gettingStartedExtraText = "";
  whereIsMyDataText = "";
  howToPublishDataText = "";
  ingestManualExtraText = "";
  whereAreMyProposalsExtraText = "";
  whereAreMySamplesExtraText = "";
  constructor(public appConfigService: AppConfigService) {}

  ngOnInit() {
    this.facility = this.appConfig.facility;
    this.ingestManual = this.appConfig.ingestManual;
    this.helpMessages = new HelpMessages(
      this.appConfig.helpMessages?.gettingStarted,
      this.appConfig.helpMessages?.ingestManual,
    );
    this.gettingStarted = this.appConfig.gettingStarted;
    this.shoppingCartEnabled = this.appConfig.shoppingCartEnabled;
    this.docText = 
      this.appConfig.docText || 
      "This is our documentation homepage https://scicatproject.github.io/. Following the documentation link (blue button at top left) you will find detailed information for Users, Developers, Operators and Ingestors.";
    this.gettingStartedExtraText = 
      this.appConfig.gettingStartedExtraText || 
      "";
    let rawText = 
      this.appConfig.whereIsMyDataText || 
      "Your data is stored and can be accessed by logging into {{ facility }} using sftp to download a file. Alternatively, individual datafiles can be downloaded by clicking on a datafiles tab for a given dataset, however this is not recommended for large datasets.";
    this.whereIsMyDataText = rawText.replace(
      "{{ facility }}", this.facility
    );
    this.howToPublishDataText = 
      this.appConfig.howToPublishDataText || 
      "Select datasets in the dataset table and add to <b>Cart</b>. Once in <b>Cart</b>, click <b>Publish</b> and follow instructions."; 
    this.ingestManualExtraText = 
      this.appConfig.ingestManualExtraText || 
      "";
    this.whereAreMyProposalsExtraText = 
      this.appConfig.whereAreMyProposalsExtraText || 
      "";
    this.whereAreMySamplesExtraText = 
      this.appConfig.whereAreMySamplesExtraText || 
      "";
  }
}
