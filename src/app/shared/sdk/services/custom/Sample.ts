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
import { Sample } from "../../models/Sample";
import { SocketConnection } from "../../sockets/socket.connections";
import { Dataset } from "../../models/Dataset";
import { Attachment } from "../../models/Attachment";

/**
 * Api services for the `Sample` model.
 *
 * **Details**
 *
 * Models describing the characteristics of the samples to be investigated. Raw datasets should be linked to such sample definitions.
 */
@Injectable()
export class SampleApi extends BaseLoopBackApi {
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
   * Fetches belongsTo relation datasets.
   *
   * @param {any} id Sample id
   *
   * @param {boolean} refresh
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Sample` object.)
   * </em>
   */
  public getDatasets(
    id: any,
    refresh: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/:id/datasets";
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
   * Find a related item by id for attachments.
   *
   * @param {any} id Sample id
   *
   * @param {any} fk Foreign key for attachments
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Sample` object.)
   * </em>
   */
  public findByIdAttachments(
    id: any,
    fk: any,
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/:id/attachments/:fk";
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
   * Delete a related item by id for attachments.
   *
   * @param {any} id Sample id
   *
   * @param {any} fk Foreign key for attachments
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public destroyByIdAttachments(
    id: any,
    fk: any,
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "DELETE";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/:id/attachments/:fk";
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
   * Update a related item by id for attachments.
   *
   * @param {any} id Sample id
   *
   * @param {any} fk Foreign key for attachments
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
   * This usually means the response is a `Sample` object.)
   * </em>
   */
  public updateByIdAttachments(
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
      "/Samples/:id/attachments/:fk";
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
   * Queries attachments of Sample.
   *
   * @param {any} id Sample id
   *
   * @param {object} filter
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Sample` object.)
   * </em>
   */
  public getAttachments(
    id: any,
    filter: LoopBackFilter = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/:id/attachments";
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
   * Creates a new instance in attachments of this model.
   *
   * @param {any} id Sample id
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
   * This usually means the response is a `Sample` object.)
   * </em>
   */
  public createAttachments(
    id: any,
    data: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "POST";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/:id/attachments";
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
   * Deletes all attachments of this model.
   *
   * @param {any} id Sample id
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public deleteAttachments(id: any, customHeaders?: Function): Observable<any> {
    let _method: string = "DELETE";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/:id/attachments";
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
   * Counts attachments of Sample.
   *
   * @param {any} id Sample id
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
  public countAttachments(
    id: any,
    where: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/:id/attachments/count";
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
   * This usually means the response is a `Sample` object.)
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
      "/Samples";
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
   * @param {any} id Sample id
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
   * This usually means the response is a `Sample` object.)
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
      "/Samples/:id";
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
   * This usually means the response is a `Sample` object.)
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
      "/Samples/fullfacet";
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
   * This usually means the response is a `Sample` object.)
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
      "/Samples/fullquery";
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
   * This usually means the response is a `Sample` object.)
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
      "/Samples/isValid";
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
   * Get a list of sample characteristic keys
   *
   * @param {object} fields Define the filter conditions by specifying the name of values of fields requested. There is also support for a `text` search to look for strings anywhere in the sample.
   *
   * @param {object} limits Define further query parameters like skip, limit, order
   *
   * @param {object} options
   *
   * @returns {object[]} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Array of sample characteristic keys
   */
  public metadataKeys(
    fields: any = {},
    limits: any = {},
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "GET";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/metadataKeys";
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
   * Creates a new instance in attachments of this model.
   *
   * @param {any} id Sample id
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
   * This usually means the response is a `Sample` object.)
   * </em>
   */
  public createManyAttachments(
    id: any,
    data: any[] = [],
    customHeaders?: Function,
  ): Observable<any> {
    let _method: string = "POST";
    let _url: string =
      LoopBackConfig.getPath() +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/Samples/:id/attachments";
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
   * i.e. `Sample`.
   */
  public getModelName() {
    return "Sample";
  }
}
