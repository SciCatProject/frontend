import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { ADAuthService } from "./adauth.service";

import { MockHttp } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";
import { Configuration } from "@scicatproject/scicat-sdk-ts";

describe("ADAuthService", () => {
  let service: ADAuthService;

  const getConfig = () => ({
    externalAuthEndpoint: "/auth/msad",
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ADAuthService,
        {
          provide: AppConfigService,
          useValue: { getConfig },
        },
        {
          provide: Configuration,
          useClass: Configuration,
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
