import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfigService } from "../../app-config.service";

@Injectable({
  providedIn: "root",
})
export class UserSettingsService {
  private settingsUrl =
    this.appConfigService.getConfig().lbBaseURL + "/api/settings/default"; // URL to web API

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
  ) {}

  getDefaultSettings(): Observable<any> {
    return this.http.get<any>(this.settingsUrl);
  }
}
