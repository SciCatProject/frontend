import { TestBed } from "@angular/core/testing";

import { SampleService } from "./sample.service";
import { SampleApi } from "../shared/sdk/services/custom";
import { MockSampleApi } from "../shared/MockStubs";

describe("SampleService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SampleApi,
      {
        provide: SampleApi,
        useClass: MockSampleApi
      }
    ]
  }));

  it("should be created", () => {
    const service: SampleService = TestBed.get(SampleService);
    expect(service).toBeTruthy();
  });
});
