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
  facility: string | null = null;
  ingestManual: string | null = null;
  gettingStarted: string | null = null;
  shoppingCartEnabled = false;
  helpHtmlContent: SafeHtml | string = "";
  helpMessages: HelpMessages;
  supportEmail: string | undefined;
  constructor(
    public appConfigService: AppConfigService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.facility = this.appConfig.facility;
    this.ingestManual = this.appConfig.ingestManual;
    this.helpMessages = new HelpMessages(
      this.appConfig.helpMessages?.gettingStarted,
      this.appConfig.helpMessages?.ingestManual,
    );
    this.gettingStarted = this.appConfig.gettingStarted;
    this.shoppingCartEnabled = this.appConfig.shoppingCartEnabled;
    this.supportEmail = this.appConfig.supportEmail;
    this.helpHtmlContent = this.sanitizer.bypassSecurityTrustHtml(
      this.appConfig.helpHtmlContent || "",
    );
  }
}
