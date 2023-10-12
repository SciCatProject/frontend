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
  }
}
