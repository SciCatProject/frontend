import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { ADAuthService } from "./adauth.service";

import { MockHttp } from "shared/MockStubs";
import { APP_CONFIG } from "app-config.module";

describe("ADAuthService", () => {
  let service: ADAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ADAuthService,
        {
          provide: APP_CONFIG,
          useValue: { externalAuthEndpoint: "/auth/msad" },
        },
        { provide: HttpClient, useClass: MockHttp },
      ],
    });

    service = TestBed.inject(ADAuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // TODO update to call login method and test resuling URL
  //  it('authURL should be equal to that set in the service', inject([ADAuthService], (service: ADAuthService) => {
  //  }));
});
