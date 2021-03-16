import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoopBackAuth } from "shared/sdk";
import * as moment from "moment";
import { Column } from "shared/modules/shared-table/shared-table.module";

@Injectable({
  providedIn: "root",
})
export class ScicatDataService {
  private accessToken: string;

  constructor(private http: HttpClient, private auth: LoopBackAuth) {
    this.accessToken = auth.getToken().id;
    // console.log("Got token:", this.accessToken);
  }

  findDataById(url: string, dataId: number): Observable<any> {
    return this.http.get<any>(`${url}/${dataId}`);
  }

  // TODO when do I need to use "mode" syntax (may be for nested keys ?)
  createColumnFilterMongoExpression = (columns: Column[], filterExpressions: any) => {
    const result = {};
    if (filterExpressions) {
      Object.keys(filterExpressions).forEach((key, index) => {
        if (filterExpressions[key] !== "") {
          // console.log("filterexpression:", key, filterExpressions[key], columns)
          const column = columns.find((c) => c.id === key);
          // All non-column conditions are ignored here
          if (column) {
            switch (column.matchMode) {
              case "contains": {
                result[key] = { $regex: filterExpressions[key], $options: "i" };
                break;
              }
              case "greaterThan": {
                result[key] = { $gt: Number(filterExpressions[key]) };
                break;
              }
              case "lessThan": {
                result[key] = { $lt: Number(filterExpressions[key]) };
                break;
              }
              case "after": {
                result[key] = { $gte: filterExpressions[key] };
                break;
              }
              case "between": {
                // console.log("between case");
                let be: any;
                // TODO why can the filterExpression be sometimes an object and sometimes not ?
                // TODO: is between always date related (assume this for now)
                if (typeof filterExpressions[key] === "object") {
                  be = filterExpressions[key];
                } else {
                  be = JSON.parse(filterExpressions[key]);
                }
                // convert to UTC and add one day to end expression
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const blocal = moment.tz(be.begin, tz);
                const elocal = moment.tz(be.end, tz).add(1, "days");
                // TODO is treated as a full string, not a nested object if key contains
                // console.log("====== Key is nested :", key);
                result[key] = { begin: blocal.toISOString(), end: elocal.toISOString() };
                // console.log("result:", result);
                break;
              }
              case "is": {
                result[key] = filterExpressions[key];
                break;
              }
              default: {
                result[key] = { $regex: filterExpressions[key], $options: "i" };
                break;
              }
            }
          }
        }
      });
    }
    // console.log("Result of map:",result)
    return result;
  };

  findAllData(
    url: string,
    columns: Column[],
    globalFilter = "",
    filterExpressions = {},
    sortField?: string,
    sortOrder = "asc",
    pageNumber = 0,
    pageSize = 10
  ): Observable<any[]> {
    // Dataset filter syntax (not used here)
    // {"limit":3,"skip":11,"where":{"ownerGroup":"p16633"},"order":"size ASC"}

    // fullQuery syntax
    // allows to including full text search and filter on individual fields
    // v3/Datasets/fullquery?fields=...&limits=

    // fields	{"mode":{"datasetlifecycle.retrievable":true,"datasetlifecycle.archivable":false},
    //         "text":"wasp","creationLocation":["/PSI/SLS/TOMCAT"],"isPublished":false}
    // The mode field can have any valiq query expression, as described in
    // https://docs.mongodb.com/manual/tutorial/query-documents/#read-operations-query-argument
    // and https://docs.mongodb.com/manual/reference/operator/query/

    // limits	{"skip":0,"limit":50,"order":"creationTime:desc"}

    // ("findalldata:", filterExpressions)
    const mongoExpression = this.createColumnFilterMongoExpression(columns, filterExpressions);
    const filterFields = { ...mongoExpression };

    if (globalFilter !== "") {
      filterFields["text"] = globalFilter;
    }

    const limits = { limit: pageSize, skip: pageSize * pageNumber };
    if (sortField) {
      limits["order"] = sortField + ":" + sortOrder;
    }

    // console.log("Fields:", filterFields)
    // console.log("Limits:", limits)

    const params = new HttpParams()
      .set("fields", JSON.stringify(filterFields))
      .set("limits", JSON.stringify(limits))
      .append("access_token", this.accessToken);
    return this.http.get<any[]>(`${url}/fullquery`, { params });
  }

  // use fullfacets instead of count to allow for more complex filters. facet "all" is default I assume
  // fields	{"mode":{},"text":"wasp","creationLocation":["/PSI/SLS/TOMCAT"],"isPublished":false}
  // facets	["type","creationTime","creationLocation","ownerGroup","keywords"]
  getCount(
    url: string,
    columns: Column[],
    globalFilter?: string,
    filterExpressions?: any
  ): Observable<any> {

    const mongoExpression = this.createColumnFilterMongoExpression(columns, filterExpressions);
    const filterFields = { ...mongoExpression };

    if (globalFilter !== "") {
      filterFields["text"] = globalFilter;
    }
    const params = new HttpParams()
      .set("fields", JSON.stringify(filterFields))
      .set("facets", JSON.stringify([]))
      .append("access_token", this.accessToken);

    return this.http.get<any>(`${url}/fullfacet`, { params });
  }
}
