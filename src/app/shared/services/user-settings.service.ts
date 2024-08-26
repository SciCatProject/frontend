import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoopBackConfig, UserSettingInterface } from "../sdk";

@Injectable({
  providedIn: "root",
})
export class UserSettingsService {
  private defaultSettingsUrl =
    LoopBackConfig.getPath() +
    "/" +
    LoopBackConfig.getApiVersion() +
    "/Users/settings/default";

  constructor(private http: HttpClient) {}

  getDefaultSettings(): Observable<UserSettingInterface> {
    return this.http.get<UserSettingInterface>(this.defaultSettingsUrl);
  }
}
