import { Component, OnInit, Inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "app-login-header",
  templateUrl: "./login-header.component.html",
  styleUrls: ["./login-header.component.scss"]
})
export class LoginHeaderComponent implements OnInit {
  title: string;
  facility: string;
  status: string;

  constructor(
    private titleService: Title,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.facility = appConfig.facility;
    if (appConfig.production === true) {
      this.status = "";
    } else {
      this.status = "test";
    }
    this.title = "SciCat " + this.facility + " " + this.status;
    this.titleService.setTitle(this.title);
  }

  ngOnInit() {}
}
