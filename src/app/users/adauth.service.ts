import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { LoopBackConfig } from "shared/sdk/lb.config";
import { Observable } from "rxjs";
import { APP_CONFIG, AppConfig } from "../app-config.module";

/**
 * Handles log in requests for AD and Functional users
 * @export
 * @class ADAuthService
 */

export interface AccessToken {
  access_token: string;
  userId;
}

@Injectable()
export class ADAuthService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {}

  /**
   * Logs a user in using either AD
   * or falling back to functional if the boolean is false
   * @param {string} username
   * @param {string} password
   * @param {boolean} [activeDir=true]
   * @returns {Observable<Response>}
   * @memberof ADAuthService
   */
  login(
    username: string,
    password: string
  ): Observable<HttpResponse<AccessToken>> {
    const creds = {};
    creds["username"] = username;
    creds["password"] = password;
    const headers = new HttpHeaders();
    const url = LoopBackConfig.getPath() + this.config.externalAuthEndpoint;
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post<AccessToken>(url, creds, { observe: "response" });
  }
}
