import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfigService, AppConfig } from "app-config.service";
import {
  OtherHealthResponse,
  OtherVersionResponse,
  UserInfo,
} from "../models/ingestor/models";

const INGESTOR_API_ENDPOINTS_V1 = {
  AUTH: {
    LOGIN: "login",
    LOGOUT: "logout",
    USERINFO: "userinfo",
  },
  DATASET: "dataset",
  DATASET_BROWSE: "dataset/browse",
  TRANSFER: "transfer",
  OTHER: {
    VERSION: "version",
    HEALTH: "health",
  },
  EXTRACTOR: "extractor",
  METADATA: "metadata",
};

@Injectable({
  providedIn: "root",
})
export class Ingestor {
  config: AppConfig;
  constructor(
    private http: HttpClient,
    public appConfigService: AppConfigService,
  ) {
    this.config = this.appConfigService.getConfig();
  }

  getVersion(): Observable<OtherVersionResponse> {
    return this.http.get<OtherVersionResponse>(
      `${this.config.ingestorURL}/${INGESTOR_API_ENDPOINTS_V1.OTHER.VERSION}`,
    );
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(
      `${this.config.ingestorURL}/${INGESTOR_API_ENDPOINTS_V1.AUTH.USERINFO}`,
    );
  }

  getHealth(): Observable<OtherHealthResponse> {
    return this.http.get<OtherHealthResponse>(
      `${this.config.ingestorURL}/${INGESTOR_API_ENDPOINTS_V1.OTHER.HEALTH}`,
    );
  }
}
