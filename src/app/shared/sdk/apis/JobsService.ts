import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpEvent,
  HttpParameterCodec,
  HttpContext,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuration } from "@scicatproject/scicat-sdk-ts";
import { Job, JobInterface } from "../models/Job";

interface JobsServiceInterfaceV4 {
  defaultHeaders: HttpHeaders;
  configuration: Configuration;
  /**
   *
   *
   * @param createJobDto
   */
  jobsControllerCreateV4(createJobDto: Job, extraHttpRequestParams?: any): Observable<JobInterface>;
}

@Injectable({
  providedIn: "root",
})
export class JobsServiceV4 implements JobsServiceInterfaceV4 {
  protected httpClient: HttpClient;
  defaultHeaders: HttpHeaders;
  configuration: Configuration;
  encoder: HttpParameterCodec;

  constructor(httpClient: HttpClient, configuration: Configuration) {
    this.httpClient = httpClient;
    this.configuration = configuration;
  };

  jobsControllerCreateV4(createJobDto: Job, observe?: "body", reportProgress?: boolean, options?: {
      httpHeaderAccept?: "application/json";
      context?: HttpContext;
  }): Observable<JobInterface>;
  jobsControllerCreateV4(createJobDto: Job, observe?: "response", reportProgress?: boolean, options?: {
      httpHeaderAccept?: "application/json";
      context?: HttpContext;
  }): Observable<HttpResponse<JobInterface>>;
  jobsControllerCreateV4(createJobDto: Job, observe?: "events", reportProgress?: boolean, options?: {
      httpHeaderAccept?: "application/json";
      context?: HttpContext;
  }): Observable<HttpEvent<JobInterface>>;

  jobsControllerCreateV4(createJobDto: Job, observe: any = "body", reportProgress: boolean = false, options: {
    httpHeaderAccept?: "application/json";
    context?: HttpContext;
  } = {}): Observable<any> {
    const headers = this.defaultHeaders;
    const url = `${this.configuration.basePath}/api/v3/jobs`;

    return this.httpClient.post<JobInterface>(url,
      {
        ...createJobDto,
        createdBy: undefined,
      }, {
      headers: headers,
      observe: observe,
      reportProgress: reportProgress,
      ...options
    });
  }
}
