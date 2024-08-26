import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { UserSettingsService } from "./user-settings.service";
import { UserSetting } from "../sdk";

describe("UnitsService", () => {
  let service: UserSettingsService;
  let httpMock: HttpTestingController;

  const getConfig = () => ({
    lbBaseURL: "",
  });

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [UserSettingsService],
    }),
  );

  beforeEach(() => {
    service = TestBed.inject(UserSettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("#getDefaultSettings()", () => {
    it("should return the unit symbol if present in dictionary", () => {
      const mockSettings = {
        conditions: [],
        filters: [{ type: "TextFilterComponent", visible: false }],
      } as UserSetting;

      service.getDefaultSettings().subscribe((settings) => {
        expect(settings).toEqual(mockSettings);
      });

      // Mock the HTTP request and provide the expected response
      const req = httpMock.expectOne((request) =>
        request.url.endsWith("/settings/default"),
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockSettings);
    });
  });
});
