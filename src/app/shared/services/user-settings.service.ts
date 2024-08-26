import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoopBackConfig } from "../sdk";

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

  getDefaultSettings(): Observable<any> {
    return this.http.get<any>(this.defaultSettingsUrl);
  }
}
