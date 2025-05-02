/* eslint @typescript-eslint/no-empty-function:0 */

import { Observable, of } from "rxjs";
import { convertToParamMap, UrlTree } from "@angular/router";
import { AppConfig } from "app-config.module";
import { SciCatDataSource } from "./services/scicat.datasource";
import {
  ActionConfig,
  ActionDataset,
} from "datasets/datafiles-actions/datafiles-action.interfaces";
import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import {
  Attachment,
  Instrument,
  JobClass,
  OutputDatasetObsoleteDto,
  ProposalClass,
  PublishedData,
  SampleClass,
  Logbook,
  Policy,
  ReturnedUserDto,
  OutputAttachmentV3Dto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { SDKToken } from "./services/auth/auth.service";

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

  usersControllerGetUserJWTV3() {
    return of("");
  }
}

export class MockAuthService {
  private token = new SDKToken();

  protected load(prop: string) {
    return "";
  }

  protected persist(
    prop: string,
    value: string | number | Date | boolean,
    expires?: Date,
  ): void {}

  public clear(): void {}

  public setRememberMe(value: boolean): void {}

  public setUser(user: ReturnedUserDto) {
    this.save();
  }

  public setToken(token: SDKToken): void {
    this.save();
  }

  public getToken(): SDKToken {
    return this.token;
  }

  public getAccessTokenId(): string {
    return this.token.id;
  }

  public getCurrentUserId() {
    return this.token.userId;
  }

  public getCurrentUserData() {
    return typeof this.token.user === "string"
      ? JSON.parse(this.token.user)
      : this.token.user;
  }

  public isAuthenticated() {
    return !(
      this.getCurrentUserId() === "" ||
      this.getCurrentUserId() == null ||
      this.getCurrentUserId() == "null"
    );
  }

  public save(): boolean {
    return true;
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

  datasetsControllerFindAllV3() {
    return of([]);
  }

  datasetsControllerFindByIdV3() {
    return of([]);
  }

  datasetsControllerCountV3(data?: any) {
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
    observer.next(null);
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

  public select(selector) {
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
  publishedDataControllerFindOneV3() {
    return of({
      creator: "string",
      publicationYear: "string",
      doi: "string",
      affiliation: "string",
      publisher: "string",
      authorList: "string",
    });
  }

  publishedDataControllerFindAllV3() {
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

  publishedDataControllerFormPopulateV3() {
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

export class MockDatafilesActionsComponent {
  actionsConfig: ActionConfig[];
  dataset: ActionDataset;
  files: DataFiles_File[];
}

export class MockHtmlElement {
  id = "";
  tag = "HTML";
  innerHTML = "";
  value = "";
  name = "";
  disabled = false;
  style: unknown = { display: "block", backgroundColor: "red" };
  children: MockHtmlElement[] = [];

  constructor(tag = "", id = "") {
    this.id = id;
    this.tag = tag;
  }
  createElement(t: string, id = "") {
    return new MockHtmlElement(t, id);
  }
  appendChild(x: MockHtmlElement) {
    this.children.push(x);
    return x;
  }
  clear() {
    this.children = [];
  }
  querySelector(sel: string) {
    // too hard to implement correctly, so just hack something
    const list = this.getElementsByTagName(sel);
    return list.length > 0 ? list[0] : this.children[0];
  }
  querySelectorAll(sel: string) {
    // too hard to implement correctly, so just return all children
    return this.children;
  }
  getElementById(id: string): any {
    // if not found, just CREATE one!!
    return (
      this.children.find((x) => x.id == id) ||
      this.appendChild(this.createElement("", id))
    );
  }
  getElementsByClassName(classname: string): any[] {
    return this.children.filter((x: any) => x.classList.contains(classname));
  }
  getElementsByName(name: string): any[] {
    return this.children.filter((x: any) => x.name == name);
  }
  getElementsByTagName(tag: string): any[] {
    return this.children.filter((x: any) => x.tag == tag.toUpperCase());
  }
  submit() {}
}

export function createMock<T>(data?: Partial<T>): T {
  return data as T;
}

export const mockDataset = createMock<OutputDatasetObsoleteDto>({});
export const mockAttachment = createMock<OutputAttachmentV3Dto>({});
export const mockSample = createMock<SampleClass>({});
export const mockProposal = createMock<ProposalClass>({});
export const mockInstrument = createMock<Instrument>({});
export const mockJob = createMock<JobClass>({}); // TODO: job release back-ward compatibility issue
export const mockLogbook = createMock<Logbook>({});
export const mockPolicy = createMock<Policy>({});
export const mockPublishedData = createMock<PublishedData>({});
export const mockUser = createMock<ReturnedUserDto>({});
