import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { INGESTOR_API_ENDPOINTS_V1 } from "./ingestor-api-endpoints";
import {
  DeleteTransferRequest,
  DeleteTransferResponse,
  GetDatasetResponse,
  GetExtractorResponse,
  GetTransferResponse,
  OtherHealthResponse,
  OtherVersionResponse,
  PostDatasetRequest,
  UserInfo,
} from "ingestor/model/models";

@Injectable({
  providedIn: "root",
})
export class IngestorAPIManager {
  private connectUrl: string;
  private connectOptions: object;

  constructor(private http: HttpClient) {}

  public connect(url: string, withCredentials = true): void {
    this.connectUrl = url;
    this.connectOptions = {
      withCredentials: withCredentials,
      headers: new HttpHeaders({
        "Content-Type": "application/json;charset=UTF-8",
      }),
    };
  }

  public getVersion(): Promise<OtherVersionResponse> {
    const params = new HttpParams();
    return new Promise((resolve, reject) => {
      this.http
        .get(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.OTHER.VERSION, {
          params,
          ...this.connectOptions,
        })
        .subscribe(
          (response) => {
            resolve(response as OtherVersionResponse);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  public getUserInfo(): Promise<UserInfo> {
    const params = new HttpParams();
    return new Promise((resolve, reject) => {
      this.http
        .get(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.AUTH.USERINFO, {
          params,
          ...this.connectOptions,
        })
        .subscribe(
          (response) => {
            resolve(response as UserInfo);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  public getHealth(): Promise<OtherHealthResponse> {
    const params = new HttpParams();
    return new Promise((resolve, reject) => {
      this.http
        .get(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.OTHER.HEALTH, {
          params,
          ...this.connectOptions,
        })
        .subscribe(
          (response) => {
            resolve(response as OtherHealthResponse);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  public cancelTransfer(transferId: string): Promise<DeleteTransferResponse> {
    const body: DeleteTransferRequest = { transferId: transferId };

    console.log("Cancel transfer", transferId);
    return new Promise((resolve, reject) => {
      this.http
        .delete(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.TRANSFER, {
          body,
          ...this.connectOptions,
        })
        .subscribe(
          (response) => {
            resolve(response as DeleteTransferResponse);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  public getTransferList(
    page: number,
    pageSize: number,
    transferId?: string,
  ): Promise<GetTransferResponse> {
    const params: any = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    if (transferId) {
      params.transferId = transferId;
    }
    return new Promise((resolve, reject) => {
      this.http
        .get(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.TRANSFER, {
          params,
          ...this.connectOptions,
        })
        .subscribe(
          (response) => {
            resolve(response as GetTransferResponse);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  public startIngestion(payload: PostDatasetRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.DATASET, payload, {
          ...this.connectOptions,
        })
        .subscribe(
          (response) => {
            const returnValue = JSON.stringify(response);
            resolve(returnValue);
          },
          (error) => {
            console.error("Upload failed", error);
            reject(error);
          },
        );
    });
  }

  public getExtractionMethods(
    page: number,
    pageSize: number,
  ): Promise<GetExtractorResponse> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());

    return new Promise((resolve, reject) => {
      this.http
        .get(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.EXTRACTOR, {
          params,
          ...this.connectOptions,
        })
        .subscribe(
          (response: GetExtractorResponse) => {
            resolve(response as GetExtractorResponse);
          },
          (error) => {
            console.error(error);
            reject(error);
          },
        );
    });
  }

  public getAvailableFilePaths(
    page: number,
    pageSize: number,
  ): Promise<GetDatasetResponse> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());

    return new Promise((resolve, reject) => {
      this.http
        .get(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.DATASET, {
          params,
          ...this.connectOptions,
        })
        .subscribe(
          (response: GetDatasetResponse) => {
            resolve(response as GetDatasetResponse);
          },
          (error) => {
            console.error(error);
            reject(error);
          },
        );
    });
  }
}
