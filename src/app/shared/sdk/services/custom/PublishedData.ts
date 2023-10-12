/* eslint-disable */
import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SDKModels } from "./SDKModels";
import { BaseLoopBackApi } from "../core/base.service";
import { LoopBackConfig } from "../../lb.config";
import { LoopBackAuth } from "../core/auth.service";
import { LoopBackFilter } from "../../models/BaseModels";
import { ErrorHandler } from "../core/error.service";
import { Observable } from "rxjs";
import { SocketConnection } from "../../sockets/socket.connections";

/**
 * Api services for the `PublishedData` model.
 *
 * **Details**
 *
 * Stores the meta data information for an accessible, published and DOI-identified collection of datasets. It defines a list of mandatory and optional metadata fields to be included. DataCite mandatory fields, a full URL to the landing page and modification times are included.
 */
@Injectable()
export class PublishedDataApi extends BaseLoopBackApi {
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
   * Find a related item by id for datasets.
   *
   * @param {any} id PublishedData id
   *
   * @param {any} fk Foreign key for datasets
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PublishedData` object.)
   * </em>
   */
  public findByIdDatasets(
    id: any,
    fk: any,
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/datasets/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk,
    };
    let _postBody: any = {};
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
   * Delete a related item by id for datasets.
   *
   * @param {any} id PublishedData id
   *
   * @param {any} fk Foreign key for datasets
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public destroyByIdDatasets(
    id: any,
    fk: any,
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "DELETE";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/datasets/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk,
    };
    let _postBody: any = {};
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
   * Update a related item by id for datasets.
   *
   * @param {any} id PublishedData id
   *
   * @param {any} fk Foreign key for datasets
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
   * This usually means the response is a `PublishedData` object.)
   * </em>
   */
  public updateByIdDatasets(
    id: any,
    fk: any,
    data: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "PUT";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/datasets/:fk";
    let _routeParams: any = {
      id: id,
      fk: fk,
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
   * Queries datasets of PublishedData.
   *
   * @param {any} id PublishedData id
   *
   * @param {object} filter
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PublishedData` object.)
   * </em>
   */
  public getDatasets(
    id: any,
    filter: LoopBackFilter = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/datasets";
    let _routeParams: any = {
      id: id,
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof filter !== "undefined" && filter !== null)
      _urlParams.filter = filter;
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
   * Creates a new instance in datasets of this model.
   *
   * @param {any} id PublishedData id
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
   * This usually means the response is a `PublishedData` object.)
   * </em>
   */
  public createDatasets(
    id: any,
    data: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "POST";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/datasets";
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
   * Deletes all datasets of this model.
   *
   * @param {any} id PublishedData id
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public deleteDatasets(id: any, customHeaders?: Function): Observable<any> {
    let _method: string = "DELETE";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/datasets";
    let _routeParams: any = {
      id: id,
    };
    let _postBody: any = {};
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
   * Counts datasets of PublishedData.
   *
   * @param {any} id PublishedData id
   *
   * @param {object} where Criteria to match model instances
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` -
   */
  public countDatasets(
    id: any,
    where: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/datasets/count";
    let _routeParams: any = {
      id: id,
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof where !== "undefined" && where !== null)
      _urlParams.where = where;
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
   * This usually means the response is a `PublishedData` object.)
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
      "/PublishedData";
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
   * @param {any} id PublishedData id
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
   * This usually means the response is a `PublishedData` object.)
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
      "/PublishedData/:id";
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
   * This usually means the response is a `PublishedData` object.)
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
      "/PublishedData/fullfacet";
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
   * This usually means the response is a `PublishedData` object.)
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
      "/PublishedData/fullquery";
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
   * <em>
   * (The remote method definition does not provide any description.)
   * </em>
   *
   * @param {string} pid
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PublishedData` object.)
   * </em>
   */
  public formPopulate(pid: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/formPopulate";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof pid !== "undefined" && pid !== null) _urlParams.pid = pid;
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
   * <em>
   * (The remote method definition does not provide any description.)
   * </em>
   *
   * @param {object} data Request data.
   *
   *  - `id` – `{string}` -
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `doi` – `{string}` -
   */
  public register(id: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/register";
    let _routeParams: any = {
      id: id,
    };
    let _postBody: any = {};
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
   * <em>
   * (The remote method definition does not provide any description.)
   * </em>
   *
   * @param {object} data Request data.
   *
   *  - `id` – `{string}` -
   *
   *  - `data` – `{object}` -
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `doi` – `{string}` -
   */
  public resync(id: any, data: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/resync";
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
   * Creates a new instance in datasets of this model.
   *
   * @param {any} id PublishedData id
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `PublishedData` object.)
   * </em>
   */
  public createManyDatasets(
    id: any,
    data: any[] = [],
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "POST";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/PublishedData/:id/datasets";
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
   * The name of the model represented by this $resource,
   * i.e. `PublishedData`.
   */
  public getModelName() {
    return "PublishedData";
  }
}
