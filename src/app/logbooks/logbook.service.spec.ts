import { inject, TestBed } from "@angular/core/testing";
import { LogbookApi } from "shared/sdk/services";
import { MockLogbookApi } from "shared/MockStubs";

import { LogbookService } from "./logbook.service";

describe("LogbookService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        LogbookService,
        { provide: LogbookApi, useClass: MockLogbookApi }
      ]
    })
  );

  it("should be created", inject(
    [LogbookService],
    (service: LogbookService) => {
      expect(service).toBeTruthy();
    }
  ));
});
