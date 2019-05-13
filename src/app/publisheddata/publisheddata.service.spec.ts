import { TestBed } from "@angular/core/testing";

import { PublisheddataService } from "./publisheddata.service";
import { PublishedDataApi } from "shared/sdk";
import { MockPublishedDataApi } from "shared/MockStubs";

describe("PublisheddataService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        PublishedDataApi,
        {
          provide: PublishedDataApi,
          useClass: MockPublishedDataApi
        }
      ]
    })
  );

  it("should be created", () => {
    const service: PublisheddataService = TestBed.get(PublisheddataService);
    expect(service).toBeTruthy();
  });
});
