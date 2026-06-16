import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AppConfigService, HelpMessages } from "app-config.service";

@Component({
  selector: "help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"],
  standalone: false,
})
export class HelpComponent implements OnInit {
  appConfig = this.appConfigService.getConfig();

  htmlContent: SafeHtml | string = "No help content available.";

  constructor(
    public appConfigService: AppConfigService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    if (this.appConfig.helpSettings?.enabled) {
      const html = this.appConfig.helpSettings?.htmlContent;
      console.log(html);
      if (html) {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
      }
      console.log(this.htmlContent);
    } else {
      this.htmlContent = "Help page is disabled";
    }
  }
}
