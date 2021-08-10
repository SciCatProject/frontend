import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { LoopBackConfig } from "shared/sdk/lb.config";
import { Observable } from "rxjs";
import { APP_CONFIG, AppConfig } from "../app-config.module";
import { timeout } from "rxjs/operators";

export interface Credentials {
  username: string;
  password: string;
}

export interface AccessToken {
  access_token: string;
  userId: string;
}

/**
 * Handles log in requests for AD and Functional users
 * @export
 * @class ADAuthService
 */
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
    const creds: Credentials = {
      username: username,
      password: password,
    };
    const headers = new HttpHeaders();
    const url = LoopBackConfig.getPath() + this.config.externalAuthEndpoint;
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post<AccessToken>(url, creds, { observe: "response" })
      .pipe(timeout(3000));
  }
}
