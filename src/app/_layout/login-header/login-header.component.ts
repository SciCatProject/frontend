import { Component, Inject } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "app-login-header",
  templateUrl: "./login-header.component.html",
  styleUrls: ["./login-header.component.scss"]
})
export class LoginHeaderComponent {
  facility: string;
  status: string;

  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {
    this.facility = appConfig.facility;
    if (appConfig.production === true) {
      this.status = "";
    } else {
      this.status = "test";
    }
  }
}
