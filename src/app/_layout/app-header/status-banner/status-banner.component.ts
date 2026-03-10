import { Component, Output, EventEmitter } from "@angular/core";
import { AppConfigInterface, AppConfigService } from "app-config.service";

@Component({
  selector: "app-status-banner",
  templateUrl: "./status-banner.component.html",
  styleUrls: ["./status-banner.component.scss"],
  standalone: false,
})
export class StatusBannerComponent {
  @Output() dismiss = new EventEmitter<void>();
  appConfig: AppConfigInterface;
  message: string;
  code: string;

  constructor(private appConfigService: AppConfigService) {
    const appConfig = this.appConfigService.getConfig();
    this.message = appConfig.statusBannerMessage;
    if (["INFO", "WARN"].includes(appConfig.statusBannerCode)) {
      this.code = appConfig.statusBannerCode;
    } else {
      this.code = "INFO";
    }
  }

  onDismiss() {
    this.dismiss.emit();
  }
}
