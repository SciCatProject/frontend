import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfigService, AppConfig } from "app-config.service";
import {
  DepBackendVersion,
  OneDepUserInfo,
  OneDepCreated,
  UploadedFile,
} from "../models/OneDep";

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

  getVersion(): Observable<DepBackendVersion> {
    return this.http.get<DepBackendVersion>(
      `${this.config.depositorURL}/version`,
    );
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

  downloadCoordinatesWithMetadata(file: File, metadata: any) {
    const formDataFile = new FormData();
    formDataFile.append("file", file);
    formDataFile.append("scientificMetadata", JSON.stringify(metadata));

    return this.http.post(
      `${this.config.depositorURL}/onedep/pdb`,
      formDataFile,
      {
        responseType: "blob",
      },
    );
  }

  downloadMetadata(metadata: any) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = JSON.stringify(metadata);

    return this.http.post(`${this.config.depositorURL}/onedep/metadata`, body, {
      headers,
      responseType: "blob",
    });
  }
}
