import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AppConfigService {
  private appConfig: Object = {};

  constructor(private http: HttpClient) {}

  async loadAppConfig() {
    this.appConfig = await this.http.get("/assets/config.json").toPromise();
  }

  getConfig() {
    return this.appConfig;
  }
}
