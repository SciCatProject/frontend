import { Observable, of } from "rxjs";
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

export class MockMatDialogRef {
  close() {}
}

export class MockMatDialogData {}

export class MockActivatedRoute {
  // stub detail goes here
  snapshot = {
    queryParams: { returnUrl: "/" },
    paramMap: convertToParamMap({ name: "string" }),
    url: [{ path: "logbooks" }]
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

export class MockConfigService {
  getConfigFile() {
    return of([undefined]);
  }
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

export class MockArchivingService {
  public dispatch(obj) {}

  public select(obj) {
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
