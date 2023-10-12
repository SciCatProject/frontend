/* eslint-disable */
import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { SDKModels } from "./SDKModels";
import { BaseLoopBackApi } from "../core/base.service";
import { LoopBackConfig } from "../../lb.config";
import { LoopBackAuth } from "../core/auth.service";
import { LoopBackFilter } from "../../models/BaseModels";
import { ErrorHandler } from "../core/error.service";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Logbook } from "../../models/Logbook";
import { SocketConnection } from "../../sockets/socket.connections";

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
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler,
  ) {
    super(http, connection, models, auth, errorHandler);
  }

  /**
   * Find Logbook model instance by name
   *
   * @param {string} name Name of the Logbook
   *
   * @param {string} filters Filter json object, keys: textSearch, showBotMessages, showUserMessages, showImages, skip, limit, sortField
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Logbook model instance
   */
  public findByName(
    name: any,
    filters: any = {},
    customHeaders?: Function,
  ): Observable<Logbook> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Logbooks/:name";
    let _routeParams: any = {
      name: name,
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof filters !== "undefined" && filters !== null)
      _urlParams.filters = filters;
    let result = this.request(
      _method,
      _url,
      _routeParams,
      _urlParams,
      _postBody,
      null,
      customHeaders,
    );
    return result.pipe(map((instance: Logbook) => new Logbook(instance)));
  }

  /**
   * Find Logbook model instance associated to the dataset passed
   *
   * @param {string} pid Dataset pid
   *
   * @param {string} filters Filter json object, keys: textSearch, showBotMessages, showUserMessages, showImages, skip, limit, sortField
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Logbook model instance
   */
  public findDatasetLogbook(
    pid: any,
    filters: any = {},
    customHeaders?: Function,
  ): Observable<Logbook> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Datasets/:pid/Logbook";
    let _routeParams: any = {
      pid: pid,
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof filters !== "undefined" && filters !== null)
      _urlParams.filters = filters;
    let result = this.request(
      _method,
      _url,
      _routeParams,
      _urlParams,
      _postBody,
      null,
      customHeaders,
    );
    return result.pipe(map((instance: Logbook) => new Logbook(instance)));
  }

  /**
   * Send message to a Logbook
   *
   * @param {string} name Name of the Logbook
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
  public sendMessage(
    name: any,
    data: any,
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "POST";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Logbooks/:name/message";
    let _routeParams: any = {
      name: name,
    };
    let _postBody: any = {
      data: data,
    };
    let _urlParams: any = {};
    let result = this.request(
      _method,
      _url,
      _routeParams,
      _urlParams,
      _postBody,
      null,
      customHeaders,
    );
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
