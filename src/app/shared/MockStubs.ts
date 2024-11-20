/* eslint @typescript-eslint/no-empty-function:0 */

import { Observable, of } from "rxjs";
import { convertToParamMap, UrlTree } from "@angular/router";
import { AppConfig } from "app-config.module";
import { SciCatDataSource } from "./services/scicat.datasource";
import { Injectable } from "@angular/core";
import {
  ActionConfig,
  ActionDataset,
} from "datasets/datafiles-actions/datafiles-action.interfaces";
import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import {
  Attachment as AttachmentInterface,
  Datablock,
  IDatasetList,
  Instrument as InstrumentInterface,
  JobClass,
  MeasurementPeriodClass,
  OrigDatablock,
  OutputDatasetObsoleteDto,
  ProposalClass,
  PublishedData as PublishedDataInterface,
  SampleClass,
  TechniqueClass,
  Logbook as LogbookInterface,
  Policy as PolicyInterface,
  UserSettings,
  UserIdentity,
  ReturnedUserDto,
  HistoryClass,
} from "@scicatproject/scicat-sdk-ts";
import { AuthService } from "./services/auth/auth.service";

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
export class MockLoopBackAuth extends AuthService {
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

export class Dataset implements OutputDatasetObsoleteDto {
  pid: string;
  owner: string;
  ownerEmail: string;
  orcidOfOwner: string;
  contactEmail: string;
  sourceFolder: string;
  sourceFolderHost: string;
  size: number;
  packedSize: number;
  numberOfFiles: number;
  numberOfFilesArchived: number;
  creationTime: string;
  type: any;
  validationStatus: string;
  keywords: Array<string>;
  description: string;
  datasetName: string;
  classification: string;
  license: string;
  version: string;
  isPublished: boolean;
  sharedWith: Array<string>;
  ownerGroup: string;
  accessGroups: Array<string>;
  createdBy: string;
  updatedBy: string;
  history: Array<HistoryClass>;
  datasetlifecycle: object;
  publisheddataId: string;
  techniques: Array<TechniqueClass>;
  publishedDataId: string;
  createdAt: string;
  updatedAt: string;
  instrumentId: string;
  historyList: object[];
  datasetLifecycle: object[];
  publisheddata: PublishedData;
  techniquesList: object[];
  samples: SampleClass[];
  datablocks: Datablock[];
  origdatablocks: OrigDatablock[];
  attachments: AttachmentInterface[];
  instrument: InstrumentInterface;
  scientificMetadata?: object;
  principalInvestigator: string;
  creationLocation: string;
  investigator: string;
  inputDatasets: string[];
  usedSoftware: string[];

  constructor(data?: OutputDatasetObsoleteDto) {
    Object.assign(this, data);
  }
}

export class Attachment implements AttachmentInterface {
  id: string;
  thumbnail: string;
  caption: string;
  ownerGroup: string;
  accessGroups: Array<string>;
  createdBy: string;
  updatedBy: string;
  datasetId: string;
  sampleId: string;
  proposalId: string;
  rawDatasetId: string;
  derivedDatasetId: string;
  createdAt: string;
  updatedAt: string;
  dataset: Dataset;
  sample: SampleClass;
  proposal: ProposalClass;
  isPublished: boolean;

  constructor(data?: AttachmentInterface) {
    Object.assign(this, data);
  }
}

export class Sample implements SampleClass {
  sampleId: string;
  owner: string;
  description: string;
  createdAt: string;
  sampleCharacteristics: object;
  isPublished: boolean;
  ownerGroup: string;
  accessGroups: Array<string>;
  createdBy: string;
  updatedBy: string;
  datasetsId: string;
  datasetId: string;
  rawDatasetId: string;
  derivedDatasetId: string;
  updatedAt: string;
  datasets: Dataset;
  attachments: AttachmentInterface[];

  constructor(data?: SampleClass) {
    Object.assign(this, data);
  }
}

export class Proposal implements ProposalClass {
  proposalId: string;
  pi_email: string;
  pi_firstname: string;
  pi_lastname: string;
  email: string;
  firstname: string;
  lastname: string;
  title: string;
  abstract: string;
  startTime: string;
  endTime: string;
  ownerGroup: string;
  accessGroups: Array<string>;
  createdBy: string;
  updatedBy: string;
  MeasurementPeriodList: Array<MeasurementPeriodClass>;
  createdAt: string;
  updatedAt: string;
  measurementPeriods: object[];
  attachments: Attachment[];
  isPublished: boolean;
  type: string;

  constructor(data?: ProposalClass) {
    Object.assign(this, data);
  }
}

export class Instrument implements InstrumentInterface {
  pid: string;
  uniqueName: string;
  name: string;
  customMetadata: object;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  datasets: Dataset[];

  constructor(data?: InstrumentInterface) {
    Object.assign(this, data);
  }
}

export class Job implements JobClass {
  _id: string;
  id: string;
  emailJobInitiator: string;
  type: string;
  creationTime: string;
  executionTime: string;
  jobParams: object;
  jobStatusMessage: string;
  datasetList: IDatasetList[];
  jobResultObject: object;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  ownerGroup: string;

  constructor(data?: JobClass) {
    Object.assign(this, data);
  }
}

export class Logbook implements LogbookInterface {
  name: string;
  roomId: string;
  messages: Array<object>;

  constructor(data?: LogbookInterface) {
    Object.assign(this, data);
  }
}

export class Policy implements PolicyInterface {
  _id: string;
  id: string;
  manager: Array<any>;
  tapeRedundancy: string;
  autoArchive: boolean;
  autoArchiveDelay: number;
  archiveEmailNotification: boolean;
  archiveEmailsToBeNotified: Array<any>;
  retrieveEmailNotification: boolean;
  retrieveEmailsToBeNotified: Array<any>;
  embargoPeriod: number;
  ownerGroup: string;
  accessGroups: Array<any>;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;

  constructor(data?: PolicyInterface) {
    Object.assign(this, data);
  }
}

export class PublishedData implements PublishedDataInterface {
  doi: string;
  affiliation: string;
  creator: Array<string>;
  publisher: string;
  publicationYear: number;
  title: string;
  url: string;
  abstract: string;
  dataDescription: string;
  resourceType: string;
  numberOfFiles: number;
  sizeOfArchive: number;
  pidArray: Array<string>;
  authors: Array<string>;
  registeredTime: string;
  status: string;
  scicatUser: string;
  thumbnail: string;
  relatedPublications: Array<string>;
  downloadLink: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  datasets: Dataset[];

  constructor(data?: PublishedDataInterface) {
    Object.assign(this, data);
  }
}

export class User implements ReturnedUserDto {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  realm: string;
  authStrategy: string;

  constructor(data?: ReturnedUserDto) {
    Object.assign(this, data);
  }
}
