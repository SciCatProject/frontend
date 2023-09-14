import { TestBed, inject } from "@angular/core/testing";

import { ConfigService } from "./config.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";

describe("ConfigService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: HttpClient, useClass: HttpClientModule },
      ],
    });
  });

  it("should ...", inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));
});
