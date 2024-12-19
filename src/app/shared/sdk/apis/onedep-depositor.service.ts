import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfigService, AppConfig } from "app-config.service";

interface OneDepCreate {
  depID: string;
}

@Injectable({
  providedIn: "root",
})
export class Depositor {
  config: AppConfig;
  constructor(
    private http: HttpClient,
    public appConfigService: AppConfigService,
  ) {
    this.config = this.appConfigService.getConfig();
  }

  // create deposition
  createDep(body: string): Observable<OneDepCreate> {
    return this.http.post<OneDepCreate>(
      `${this.config.depositorURL}/onedep`,
      body,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // // Example POST request
  // createItem(item: any): Observable<any> {
  //   const headers = new HttpHeaders({ "Content-Type": "application/json" });
  //   return this.http.post(`${this.apiUrl}/items`, item, { headers });
  // }

  // // Example DELETE request
  // deleteItem(id: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/items/${id}`);
  // }
}
