import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';


/**
 * Retrieve json files from the loopback form
 * folder that relates to the model in question
 * @export
 * @class ConfigService
 */
@Injectable()
export class ConfigService {

  url = 'assets/models/';
  // public activeConfig: ReplaySubject<any> = new ReplaySubject(1);

  constructor(private http: Http) {}
  /**
   * return a json file for the matching file
   * or an error if not found
   * @param {any} filename
   * @returns {Observable<any>}
   * @memberof ConfigService
   */
  getConfigFile(filename): Observable<any> {
    return Observable.create(observer => {
      this.http.get(this.url + filename + '.json')
          .subscribe(
              res => {
                if (res['status'] === 200) {
                  observer.next(res.json());
                  observer.complete();
                } else {
                  console.log('not found');
                  Observable.throw(new Error('No config file found'));
                }
              },
              error => {
                // observer.next(error);
                // observer.complete();
                Observable.throw(new Error('No config file found'));
              });
    });
  }
}
