import { TestBed, inject } from "@angular/core/testing";

import { ConfigService } from "./config.service";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

describe("ConfigService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService, provideHttpClient(withInterceptorsFromDi())],
    });
  });

  it("should ...", inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));
});
