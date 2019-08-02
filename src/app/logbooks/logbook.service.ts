import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as rison from "rison";

import { LogbookApi } from "shared/sdk/services";
import { Logbook } from "shared/sdk/models";

@Injectable({
  providedIn: "root"
})
export class LogbookService {
  constructor(private logbookApi: LogbookApi) {}

  getLogbooks(): Observable<Logbook[]> {
    return this.logbookApi.findAll();
  }

  getLogbook(name: string): Observable<Logbook> {
    return this.logbookApi.findByName(name);
  }

  getFilteredEntries(name: string, filter: Object): Observable<Logbook> {
    const risonFilter = rison.encode_object(filter);
    console.log("risonFilter", risonFilter);
    return this.logbookApi.filter(name, risonFilter);
  }
}
