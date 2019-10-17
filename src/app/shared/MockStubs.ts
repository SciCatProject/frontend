import { Observable, of, Subject } from "rxjs";
import { Logbook } from "./sdk/models";
import { convertToParamMap, UrlTree } from "@angular/router";

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

export class MockMatDialogRef {}

export class MockMatDialogData {}

export class MockDatablockApi {
  getDatafiles() {
    return of([]);
  }
}

export class MockAuthService {}

export class MockLoopBackAuth {
  user = {};

  getUser() {
    return of([{ username: "admin" }]);
  }

  setUser(user) {
    this.user = user;
  }
}

export class MockLocation {}

export class MockActivatedRoute {
  // stub detail goes here
  snapshot = {
    queryParams: { returnUrl: "/" },
    paramMap: convertToParamMap({ name: "string" })
  };
  params = of([{ id: 1 }]);
  queryParams = of([{ limit: 10 }]);
  url = of([]);
  children = [];
}

export class MockRouter {
  events = new Observable(observer => {
    observer.next();
    observer.complete();
  });
  navigate = function(url, params) {};

  // jasmine.createSpy('navigate');
  navigateByUrl(url: string) {
    return url;
  }

  createUrlTree = (commands, navExtras = {}) => {};
  serializeUrl = (url: UrlTree) => "";
}

export class MockHttp {}

export class MockJobApi {
  find() {
    return of([
      [
        {
          creationTime: "2017-06-19T08:38:14.671Z",
          emailJobInitiator: "test.user@psi.ch",
          id: "59478d76d7bbe2dd2e619cb6",
          type: "retrieve"
        }
      ]
    ]);
  }
}

export class MockSampleApi {
  find() {
    return of([
      {
        sampleId: "string",
        owner: "string",
        description: "string",
        createdAt: Date,
        sampleCharacteristics: "string",
        attachments: ["string"],
        ownerGroup: "string",
        accessGroups: ["string"],
        createdBy: ["string"],
        updatedBy: ["string"],
        updatedAt: Date
      }
    ]);
  }
}

export class MockConfigService {
  getConfigFile() {
    return of([undefined]);
  }
}

export class MockJobHandlerService {}

export class MockParamsService {}

export class MockDatasetService {
  datasetChange: Subject<string> = new Subject<string>();

  // TODO hold datasets and return array of samples
  searchDatasets() {
    return null;
  }

  searchDatasetsObservable() {
    return of([]);
  }

  getBlockObservable() {
    return of([]);
  }
}

export class MockProposalApi {
  // TODO hold datasets and return array of samples
  find(filter?: any) {
    return of([]);
  }
}

export class MockUserMsgService {
  private subject = new Subject<any>();

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  sendMessage(message: object, delay = 0) {}

  clearMessage() {}
}

export class MockStore {
  public dispatch(obj) {}

  public select(obj) {
    return of([]);
  }

  public pipe(obj) {
    return of(null);
  }
}

export class MockNotificationService {
  public dispatch(obj) {}

  public select(obj) {
    return of([]);
  }
}

export class MockArchivingService {
  public dispatch(obj) {}

  public select(obj) {
    return of([]);
  }
}

export class MockLogbookApi {
  logbook: Logbook;
  findByName(name: string): Observable<Logbook> {
    return of(this.logbook);
  }

  findAll(): Observable<Logbook[]> {
    return of([this.logbook]);
  }

  filter(name: string, filter: Object): Observable<Logbook> {
    return of(this.logbook);
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
      authorList: "string"
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
        authorList: "string"
      }
    ]);
  }

  formPopulate() {
    return of({});
  }
}

export class MockShareGroupApi {
  upsert(obj) {
    return of({});
  }
}
