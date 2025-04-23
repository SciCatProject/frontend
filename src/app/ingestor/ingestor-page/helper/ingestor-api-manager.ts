import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { INGESTOR_API_ENDPOINTS_V1 } from "./ingestor-api-endpoints";
import {
  DeleteTransferRequest,
  DeleteTransferResponse,
  GetBrowseDatasetResponse,
  GetDatasetResponse,
  GetExtractorResponse,
  PostDatasetRequest,
} from "shared/sdk/models/ingestor/models";

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

  public cancelTransfer(transferId: string): Promise<DeleteTransferResponse> {
    const body: DeleteTransferRequest = { transferId: transferId };

    //console.log("Cancel transfer", transferId);
    return new Promise((resolve, reject) => {
      this.http
        .delete(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.TRANSFER, {
          body,
          ...this.connectOptions,
        })
        .subscribe({
          next: (response) => {
            resolve(response as DeleteTransferResponse);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  public startIngestion(payload: PostDatasetRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.DATASET, payload, {
          ...this.connectOptions,
        })
        .subscribe({
          next: (response) => {
            const returnValue = JSON.stringify(response);
            resolve(returnValue);
          },
          error: (error) => {
            console.error("Upload failed", error);
            reject(error);
          },
        });
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
        .subscribe({
          next: (response: GetExtractorResponse) => {
            resolve(response as GetExtractorResponse);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          },
        });
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
        .subscribe({
          next: (response: GetDatasetResponse) => {
            resolve(response as GetDatasetResponse);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          },
        });
    });
  }

  public getBrowseFilePath(
    page: number,
    pageSize: number,
    path: string,
  ): Promise<GetBrowseDatasetResponse> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString())
      .set("path", path.toString());

    return new Promise((resolve, reject) => {
      this.http
        .get(this.connectUrl + INGESTOR_API_ENDPOINTS_V1.DATASET_BROWSE, {
          params,
          ...this.connectOptions,
        })
        .subscribe({
          next: (response: GetBrowseDatasetResponse) => {
            resolve(response as GetBrowseDatasetResponse);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          },
        });
    });
  }
}
