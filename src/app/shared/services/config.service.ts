import { throwError as observableThrowError, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

/**
 * Retrieve json files from the loopback form
 * folder that relates to the model in question
 * @export
 * @class ConfigService
 */
@Injectable()
export class ConfigService {
  url = "assets/models/";
  // public activeConfig: ReplaySubject<any> = new ReplaySubject(1);

  constructor(private http: HttpClient) {}
  /**
   * return a json file for the matching file
   * or an error if not found
   * @param {string} filename
   * @returns {Observable<any>}
   * @memberof ConfigService
   */
  getConfigFile(filename: string): Observable<any> {
    return new Observable((observer) => {
      this.http
        .get(this.url + filename + ".json", { observe: "response" })
        .subscribe(
          res => {
            if (res["status"] === 200) {
              observer.next(res);
              observer.complete();
            } else {
              console.log("not found");
              observableThrowError(new Error("No config file found"));
            }
          },
          error => {
            // observer.next(error);
            // observer.complete();
            observableThrowError(new Error("No config file found"));
          }
        );
    });
  }
}
