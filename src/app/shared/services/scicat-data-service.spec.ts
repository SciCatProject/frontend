import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { ScicatDataService } from "./scicat-data-service";
import { AuthService } from "./auth/auth.service";

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
          provide: AuthService,
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
