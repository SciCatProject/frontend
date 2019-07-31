import { Component, OnInit, Inject } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"]
})
export class HelpComponent implements OnInit {
  facility: string;
  ingestManual: string;
  gettingStarted: string;
  shoppingCartEnabled: boolean;
  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}

  ngOnInit() {
    this.facility = this.appConfig.facility;
    this.ingestManual = this.appConfig.ingestManual;
    this.gettingStarted = this.appConfig.gettingStarted;
    this.shoppingCartEnabled = this.appConfig.shoppingCartEnabled;
  }
}
