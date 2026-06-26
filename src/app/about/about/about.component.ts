import { Component, OnInit } from "@angular/core";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
  standalone: false,
})
export class AboutComponent implements OnInit {
  appConfig = this.appConfigService.getConfig();

  htmlContent: SafeHtml | string = "No about content available.";

  constructor(
    public appConfigService: AppConfigService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    if (this.appConfig.aboutSettings?.enabled) {
      const html = this.appConfig.aboutSettings?.htmlContent;
      console.log(html);
      if (html) {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
      }
      console.log(this.htmlContent);
    } else {
      this.htmlContent = "Info page is disabled";
    }
  }
}
