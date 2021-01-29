/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { ErrorHandler } from '../core/error.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logbook } from '../../models/Logbook';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Logbook` model.
 */
@Injectable()
export class LogbookApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, errorHandler);
  }

  /**
   * Find Logbook model instance
   *
   * @param {string} name Name of the Logbook
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Logbook model instance
   */
  public findByName(name: any, customHeaders?: Function): Observable<Logbook> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Logbooks/:name";
    let _routeParams: any = {
      name: name
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result.pipe(map((instance: Logbook) => new Logbook(instance)));
  }

  /**
   * Find all Logbook model instances
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Array of Logbook model instances
   */
  public findAll(customHeaders?: Function): Observable<Logbook[]> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Logbooks";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result.pipe(map((instances: Array<Logbook>) =>
        instances.map((instance: Logbook) => new Logbook(instance))
    ));
  }

  /**
   * Filter Logbook entries matching query
   *
   * @param {string} name The name of the Logbook
   *
   * @param {string} filters Filter rison object, keys: textSearch, showBotMessages, showUserMessages, showImages, skip, limit, sortField
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Filtered Logbook model instance
   */
  public filter(name: any, filters: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Logbooks/:name/:filters";
    let _routeParams: any = {
      name: name,
      filters: filters
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Send message to logbook
   *
   * @param {string} name The name of the logbook
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - JSON object with the key `message`
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Object containing the event id of the message
   */
  public sendMessage(name: any, data: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/Logbooks/:name/message";
    let _routeParams: any = {
      name: name
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Logbook`.
   */
  public getModelName() {
    return "Logbook";
  }
}
