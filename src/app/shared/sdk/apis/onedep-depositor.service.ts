import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfigService, AppConfig } from "app-config.service";
import { OneDepUserInfo, OneDepCreated, UploadedFile } from "../models/OneDep";
import * as fromActions from "state-management/actions/onedep.actions";

@Injectable({
  providedIn: "root",
})
export class Depositor {
  config: AppConfig;
  constructor(
    private http: HttpClient,
    private store: Store,
    public appConfigService: AppConfigService,
  ) {
    this.config = this.appConfigService.getConfig();
  }

  createDep(body: OneDepUserInfo): Observable<OneDepCreated> {
    return this.http.post<OneDepCreated>(
      `${this.config.depositorURL}/onedep`,
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  sendFile(depID: string, form: FormData): Observable<UploadedFile> {
    return this.http.post<UploadedFile>(
      `${this.config.depositorURL}/onedep/${depID}/file`,
      form,
    );
  }
  sendCoordFile(depID: string, form: FormData): Observable<UploadedFile> {
    return this.http.post<UploadedFile>(
      `${this.config.depositorURL}/onedep/${depID}/pdb`,
      form,
    );
  }
  sendMetadata(depID: string, form: FormData): Observable<UploadedFile> {
    return this.http.post<UploadedFile>(
      `${this.config.depositorURL}/onedep/${depID}/metadata`,
      form,
    );
  }
}
