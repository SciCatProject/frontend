import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { AppConfigService } from "app-config.service";
import {
  DeleteTransferRequest,
  DeleteTransferResponse,
  GetBrowseDatasetResponse,
  GetExtractorResponse,
  GetTransferResponse,
  OtherHealthResponse,
  OtherVersionResponse,
  PostDatasetRequest,
  PostDatasetResponse,
  UserInfo,
} from "../models/ingestor/models";
import { Store } from "@ngrx/store";
import { selectIngestorEndpoint } from "state-management/selectors/ingestor.selectors";

export const INGESTOR_API_ENDPOINTS_V1 = {
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
  constructor(
    private http: HttpClient,
    public appConfigService: AppConfigService,
    private store: Store,
  ) {}

  private getRequestOptions() {
    return {
      withCredentials: true,
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
      }),
    };
  }

  getVersion(): Observable<OtherVersionResponse> {
    return this.store.select(selectIngestorEndpoint).pipe(
      take(1),
      switchMap((ingestorEndpoint) =>
        this.http.get<OtherVersionResponse>(
          `${ingestorEndpoint.facilityBackend}/${INGESTOR_API_ENDPOINTS_V1.OTHER.VERSION}`,
          this.getRequestOptions(),
        ),
      ),
    );
  }

  getUserInfo(): Observable<UserInfo> {
    return this.store.select(selectIngestorEndpoint).pipe(
      take(1),
      switchMap((ingestorEndpoint) =>
        this.http.get<UserInfo>(
          `${ingestorEndpoint.facilityBackend}/${INGESTOR_API_ENDPOINTS_V1.AUTH.USERINFO}`,
          this.getRequestOptions(),
        ),
      ),
    );
  }

  getHealth(): Observable<OtherHealthResponse> {
    return this.store.select(selectIngestorEndpoint).pipe(
      take(1),
      switchMap((ingestorEndpoint) =>
        this.http.get<OtherHealthResponse>(
          `${ingestorEndpoint.facilityBackend}/${INGESTOR_API_ENDPOINTS_V1.OTHER.HEALTH}`,
          this.getRequestOptions(),
        ),
      ),
    );
  }

  cancelTransfer(
    requestBody: DeleteTransferRequest,
  ): Observable<DeleteTransferResponse> {
    return this.store.select(selectIngestorEndpoint).pipe(
      take(1),
      switchMap((ingestorEndpoint) =>
        this.http.delete<DeleteTransferResponse>(
          `${ingestorEndpoint.facilityBackend}/${INGESTOR_API_ENDPOINTS_V1.TRANSFER}`,
          { ...this.getRequestOptions(), body: requestBody },
        ),
      ),
    );
  }

  getTransferList(
    page: number,
    pageSize: number,
    transferId?: string,
  ): Observable<GetTransferResponse> {
    const params: any = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    if (transferId) {
      params.transferId = transferId;
    }

    return this.store.select(selectIngestorEndpoint).pipe(
      take(1),
      switchMap((ingestorEndpoint) =>
        this.http.get<GetTransferResponse>(
          `${ingestorEndpoint.facilityBackend}/${INGESTOR_API_ENDPOINTS_V1.TRANSFER}`,
          { ...this.getRequestOptions(), params },
        ),
      ),
    );
  }

  startIngestion(payload: PostDatasetRequest): Observable<PostDatasetResponse> {
    return this.store.select(selectIngestorEndpoint).pipe(
      take(1),
      switchMap((ingestorEndpoint) =>
        this.http.post<PostDatasetResponse>(
          `${ingestorEndpoint.facilityBackend}/${INGESTOR_API_ENDPOINTS_V1.DATASET}`,
          payload,
          this.getRequestOptions(),
        ),
      ),
    );
  }

  getExtractionMethods(
    page: number,
    pageSize: number,
  ): Observable<GetExtractorResponse> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());

    return this.store.select(selectIngestorEndpoint).pipe(
      take(1),
      switchMap((ingestorEndpoint) =>
        this.http.get<GetExtractorResponse>(
          `${ingestorEndpoint.facilityBackend}/${INGESTOR_API_ENDPOINTS_V1.EXTRACTOR}`,
          { ...this.getRequestOptions(), params },
        ),
      ),
    );
  }

  getBrowseFilePath(
    page: number,
    pageSize: number,
    path: string,
  ): Observable<GetBrowseDatasetResponse> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString())
      .set("path", path.toString());

    return this.store.select(selectIngestorEndpoint).pipe(
      take(1),
      switchMap((ingestorEndpoint) =>
        this.http.get<GetBrowseDatasetResponse>(
          `${ingestorEndpoint.facilityBackend}/${INGESTOR_API_ENDPOINTS_V1.DATASET_BROWSE}`,
          { ...this.getRequestOptions(), params },
        ),
      ),
    );
  }
}
