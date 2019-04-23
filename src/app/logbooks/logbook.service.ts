import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { LogbookApi } from "shared/sdk/services";
import { Logbook } from "shared/sdk/models";
import { LogbookFilters } from "state-management/models";

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
    return this.logbookApi.filter(name, filter);
  }
}
