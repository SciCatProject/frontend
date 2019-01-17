import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, Optional } from '@angular/core';
import { LoopBackConfig } from '../../shared/sdk/lb.config';
import { BaseLoopBackApi } from '../../shared/sdk/services/core/base.service';
import { SocketConnection } from '../../shared/sdk/sockets/socket.connections';
import { SDKModels } from '../../shared/sdk/services/custom/SDKModels';
import { LoopBackAuth } from '../../shared/sdk/services/core/auth.service';
import { ErrorHandler } from '../../shared/sdk/services/core/error.service';

export interface IJWT {
    jwt: String;
}
@Injectable()
export class JWTService extends BaseLoopBackApi{

    constructor(
        @Inject(HttpClient) protected http: HttpClient,
        @Inject(SocketConnection) protected connection: SocketConnection,
        @Inject(SDKModels) protected models: SDKModels,
        @Inject(LoopBackAuth) protected auth: LoopBackAuth,
        @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
      ) {
        super(http,  connection,  models, auth, errorHandler);
      }

  public getJWT(data: any = {}, customHeaders?: Function) {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/jwt";
    let _routeParams: any = {};
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }
  

  public getModelName() {
    return "jwt";
  }
}
