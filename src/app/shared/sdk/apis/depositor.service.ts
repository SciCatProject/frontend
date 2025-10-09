import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfigService } from "app-config.service";
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
  appConfig = this.appConfigService.getConfig();

  constructor(
    private http: HttpClient,
    public appConfigService: AppConfigService,
  ) {
  }

  getVersion(): Observable<DepBackendVersion> {
    return this.http.get<DepBackendVersion>(
      `${this.appConfig.depositorURL}/version`,
    );
  }
  createDep(body: OneDepUserInfo): Observable<OneDepCreated> {
    return this.http.post<OneDepCreated>(
      `${this.appConfig.depositorURL}/onedep`,
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  sendFile(depID: string, form: FormData): Observable<UploadedFile> {
    return this.http.post<UploadedFile>(
      `${this.appConfig.depositorURL}/onedep/${depID}/file`,
      form,
    );
  }
  sendCoordFile(depID: string, form: FormData): Observable<UploadedFile> {
    return this.http.post<UploadedFile>(
      `${this.appConfig.depositorURL}/onedep/${depID}/pdb`,
      form,
    );
  }
  sendMetadata(depID: string, form: FormData): Observable<UploadedFile> {
    return this.http.post<UploadedFile>(
      `${this.appConfig.depositorURL}/onedep/${depID}/metadata`,
      form,
    );
  }

  downloadCoordinatesWithMetadata(file: File, metadata: any) {
    const formDataFile = new FormData();
    formDataFile.append("file", file);
    formDataFile.append("scientificMetadata", JSON.stringify(metadata));

    return this.http.post(
      `${this.appConfig.depositorURL}/onedep/pdb`,
      formDataFile,
      {
        responseType: "blob",
      },
    );
  }

  downloadMetadata(metadata: any) {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = JSON.stringify(metadata);

    return this.http.post(`${this.appConfig.depositorURL}/onedep/metadata`, body, {
      headers,
      responseType: "blob",
    });
  }

  getEmpiarSchema() {
    return this.http.get<{ schema: string }>(
      `${this.appConfig.depositorURL}/empiar/schema`,
    );
  }
}
