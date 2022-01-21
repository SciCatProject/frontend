import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AppConfigService {
  private appConfig: Object = {};

  constructor(private http: HttpClient) {}

  async loadAppConfig() {
    try {
      this.appConfig = await this.http.get("/api/v3/config").toPromise();
    } catch (err) {
      console.log("No config available in backend, trying with local config.");
      try {
        this.appConfig = await this.http.get("/assets/config.json").toPromise();
      } catch (err) {
        console.error("No config provided.");
      }
    }
  }

  getConfig() {
    return this.appConfig;
  }
}
