import { TestBed, inject } from "@angular/core/testing";

import { ConfigService } from "./config.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";

describe("ConfigService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService, HttpClient],
    });
  });

  it("should ...", inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));
});
