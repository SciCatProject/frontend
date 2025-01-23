import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { timeout } from "rxjs/operators";
import { AppConfigService } from "app-config.service";
import { Configuration } from "@scicatproject/scicat-sdk-ts-angular";

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
    private appConfigService: AppConfigService,
    private apiConfig: Configuration,
    private http: HttpClient,
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
    password: string,
  ): Observable<HttpResponse<AccessToken>> {
    const creds: Credentials = {
      username: username,
      password: password,
    };
    const appConfig = this.appConfigService.getConfig();
    const headers = new HttpHeaders();
    const url = this.apiConfig.basePath + appConfig.externalAuthEndpoint;
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post<AccessToken>(url, creds, { observe: "response" })
      .pipe(timeout(3000));
  }
}
