import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { LoopBackAuth } from "shared/sdk";

import { ScicatDataService } from "./scicat-data-service";

describe("ScicatDataServiceService", () => {
  let service: ScicatDataService;

  const loopBackAuth = {
    getToken: () => ({ id: "test" }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScicatDataService,
        { provide: HttpClient, useClass: HttpClientModule },
        {
          provide: LoopBackAuth,
          useValue: loopBackAuth,
        },
      ],
    });
    service = TestBed.inject(ScicatDataService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
