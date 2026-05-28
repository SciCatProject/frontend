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

  htmlContent: SafeHtml | string = "No content available.";

  constructor(
    public appConfigService: AppConfigService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {

    const html = this.appConfig.infoHtmlContent;
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);

    // private fileLoader: FileLoaderService
    //
    // this.fileLoader.loadFile('assets/example.html').subscribe({
    //   next: (content) => {
    //     this.fileContent = content;
    //   },
    //   error: (err) => {
    //     console.error('Error loading file:', err);
    //   },
    // });
  }
}
