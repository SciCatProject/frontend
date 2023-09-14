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
import { Datablock } from "../../models/Datablock";
import { SocketConnection } from "../../sockets/socket.connections";
import { Dataset } from "../../models/Dataset";

/**
 * Api services for the `Datablock` model.
 *
 * **Details**
 *
 * When archiving a dataset all files contained in the dataset are listed here together with their checksum information. Several datablocks can be created if the file listing is too long for a single datablock. This partitioning decision is done by the archiving system to allow for chunks of datablocks with managable sizes. E.g a dataset consisting of 10 TB of data could be split into 10 datablocks of about 1 TB each. The upper limit set by the data catalog system itself is given by the fact that documents must be smaller than 16 MB, which typically allows for datasets of about 100000 files.
 */
@Injectable()
export class DatablockApi extends BaseLoopBackApi {
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
   * Fetches belongsTo relation dataset.
   *
   * @param {any} id Datablock id
   *
   * @param {boolean} refresh
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Datablock` object.)
   * </em>
   */
  public getDataset(
    id: any,
    refresh: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Datablocks/:id/dataset";
    let _routeParams: any = {
      id: id,
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof refresh !== "undefined" && refresh !== null)
      _urlParams.refresh = refresh;
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
   * Patch an existing model instance or insert a new one into the data source.
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - Model instance data
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Datablock` object.)
   * </em>
   */
  public patchOrCreate(
    data: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "PATCH";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Datablocks";
    let _routeParams: any = {};
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
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id Datablock id
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - An object of model property name/value pairs
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Datablock` object.)
   * </em>
   */
  public patchAttributes(
    id: any,
    data: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "PATCH";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Datablocks/:id";
    let _routeParams: any = {
      id: id,
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
   * Return facet counts relevant for the given selected subset of datasets.
   *
   * @param {object} fields Define the filter conditions by specifying the name and values of fields. There ia also support for a `text` search to look for strngs anywhere in the dataset.
   *
   * @param {any} facets Defines list of field names, for which facet counts should be calculated
   *
   * @param {object} options
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Datablock` object.)
   * </em>
   */
  public fullfacet(
    fields: any = {},
    facets: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Datablocks/fullfacet";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof fields !== "undefined" && fields !== null)
      _urlParams.fields = fields;
    if (typeof facets !== "undefined" && facets !== null)
      _urlParams.facets = facets;
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
   * Return datasets fulfilling complex filter conditions, including from fields of joined models.
   *
   * @param {object} fields Define the filter conditions by specifying the name of values of fields requested. There ia also support for a `text` search to look for strings anywhere in the dataset. Skip and limit parameters allow for paging.
   *
   * @param {object} limits Define further query parameters like skip, limit, order
   *
   * @param {object} options
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Datablock` object.)
   * </em>
   */
  public fullquery(
    fields: any = {},
    limits: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Datablocks/fullquery";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof fields !== "undefined" && fields !== null)
      _urlParams.fields = fields;
    if (typeof limits !== "undefined" && limits !== null)
      _urlParams.limits = limits;
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
   * Check if data is valid according to a schema
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Datablock` object.)
   * </em>
   */
  public isValid(
    ownableItem: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "POST";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Datablocks/isValid";
    let _routeParams: any = {};
    let _postBody: any = {
      ownableItem: ownableItem,
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
   * i.e. `Datablock`.
   */
  public getModelName() {
    return "Datablock";
  }
}
