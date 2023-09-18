/* eslint @typescript-eslint/no-empty-function:0 */

import { Observable, of } from "rxjs";
import { convertToParamMap, UrlTree } from "@angular/router";
import { AppConfig } from "app-config.module";
import { SciCatDataSource } from "./services/scicat.datasource";
import { LoopBackAuth } from "./sdk";
import { Injectable } from "@angular/core";

export class MockUserApi {
  getCurrentId() {
    return 123;
  }

  getCurrent() {
    return of([{ username: "admin" }]);
  }

  getCurrentToken() {
    return { user: { username: "admin" } };
  }

  getCachedCurrent() {
    return { username: "admin" };
  }

  jwt() {
    return of("");
  }
}

export class MockUserIdentityApi {
  isValidEmail(): Observable<boolean> {
    return of(true);
  }
}

export class MockDatasetApi {
  getDatasets() {
    return of([]);
  }

  getDatablocks() {
    return of([]);
  }

  find() {
    return of([]);
  }

  findById() {
    return of([]);
  }

  count(data?: any) {
    return of(0);
  }
}

export class MockAttachmentApi {}

export class MockMatDialogRef {
  close() {}
}

export class MockMatDialogData {}

export class MockActivatedRoute {
  // stub detail goes here
  snapshot = {
    queryParams: { returnUrl: "/" },
    paramMap: convertToParamMap({ name: "string" }),
    params: { id: "string" },
    url: [{ path: "logbooks" }],
  };
  params = of([{ id: 1 }]);
  queryParams = of([{ limit: 10 }]);
  url = of([]);
  children = [];
}

export class MockRouter {
  events = new Observable((observer) => {
    observer.next();
    observer.complete();
  });
  navigate = () => {};

  // jasmine.createSpy('navigate');
  navigateByUrl(url: string) {
    return url;
  }

  createUrlTree = () => {};
  serializeUrl = (url: UrlTree) => "";
}

export class MockHttp {
  public get(url: string) {
    return of({});
  }
}

export class MockConfigService {
  getConfigFile() {
    return of([undefined]);
  }
}

export class MockAppConfigService {
  private appConfig: object = {};
  constructor(private http: null) {}

  async loadAppConfig(): Promise<void> {}
  getConfig(): AppConfig {
    return this.appConfig as AppConfig;
  }
}

export class MockStore {
  public dispatch() {}

  public select() {
    return of([]);
  }

  public pipe() {
    return of(null);
  }
}

export class MockArchivingService {
  public dispatch() {}

  public select() {
    return of([]);
  }
}

export class MockPublishedDataApi {
  findbyId() {
    return of({
      creator: "string",
      publicationYear: "string",
      doi: "string",
      affiliation: "string",
      publisher: "string",
      authorList: "string",
    });
  }

  find() {
    return of([
      {
        creator: "string",
        publicationYear: "string",
        doi: "string",
        affiliation: "string",
        publisher: "string",
        authorList: "string",
      },
    ]);
  }

  formPopulate() {
    return of({});
  }
}
export class MockScicatDataSource extends SciCatDataSource {
  loadAllData(
    filterExpressions?: any,
    sortField?: string,
    sortDirection = "asc",
    pageIndex = 0,
    pageSize = 10,
    isFilesDashboard?: boolean,
  ) {
    return {};
  }
  loadExportData(
    filterExpressions?: any,
    sortField?: string,
    sortDirection = "asc",
  ) {
    return {};
  }
}

@Injectable()
export class MockLoopBackAuth extends LoopBackAuth {
  getToken = () => ({
    id: "test",
    ttl: null,
    scopes: null,
    created: null,
    user: null,
    userId: null,
    rememberMe: false,
  });
  getAccessToken = () => ({ id: "test" });
  getAccessTokenId = () => "test";
}
