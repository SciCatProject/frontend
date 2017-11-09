import { Injectable } from '@angular/core';
import {
    Http,
    Response,
    Headers
} from '@angular/http';
import { LoopBackConfig } from 'shared/sdk/lb.config';
import {Observable} from 'rxjs/Rx';



/**
 * Handles log in requests for AD and Functional users
 * @export
 * @class ADAuthService
 */
@Injectable()
export class ADAuthService {

    constructor(public http: Http) {
    }


    /**
     * Logs a user in using either AD
     * or falling back to functional if the boolean is false
     * @param {string} username
     * @param {string} password2
     * @param {boolean} [activeDir=true]
     * @returns {Observable<Response>}
     * @memberof ADAuthService
     */
    login(username: string, password: string): Observable<Response> {
        // TODO build loopback User from AD info?
        const _creds = 'username=' + username + '&password=' + password;
        const _headers = new Headers();
        const _url: string = LoopBackConfig.getPath() + '/auth/msad';
        _headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(
            _url, _creds, {headers: _headers});
    }


}
