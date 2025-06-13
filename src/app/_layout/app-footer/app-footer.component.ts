import { Component, OnInit } from "@angular/core";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "app-app-footer",
  templateUrl: "./app-footer.component.html",
  styleUrls: ["./app-footer.component.scss"],
})
export class AppFooterComponent implements OnInit {
  appConfig = this.appConfigService.getConfig();

  imprintUrl = "";
  privacyUrl = "";

  constructor(public appConfigService: AppConfigService) {}

  ngOnInit() {
    this.imprintUrl =
      this.appConfig.imprintUrl || "https://example.com/imprint";
    this.privacyUrl =
      this.appConfig.privacyUrl || "https://example.com/privacy";
  }
}
