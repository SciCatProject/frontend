import { ThumbnailPipe } from "./thumbnail.pipe";
import { ThumbnailService } from "shared/services/thumbnail.service";
import { TestBed } from "@angular/core/testing";

describe("ThumbnailPipe", () => {
  let pipe: ThumbnailPipe;
  let thumbnailService: jasmine.SpyObj<ThumbnailService>;

  beforeEach(() => {
    const thumbnailServiceSpy = jasmine.createSpyObj("ThumbnailService", [
      "getThumbnail",
    ]);

    TestBed.configureTestingModule({
      providers: [
        ThumbnailPipe,
        { provide: ThumbnailService, useValue: thumbnailServiceSpy },
      ],
    });

    pipe = TestBed.inject(ThumbnailPipe);
    thumbnailService = TestBed.inject(
      ThumbnailService,
    ) as jasmine.SpyObj<ThumbnailService>;
  });

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should call getThumbnail with the correct PID", () => {
    const testPid = "test-pid";
    const testThumbnailUrl = "https://example.com/thumbnail.jpg";

    thumbnailService.getThumbnail.and.returnValue(
      Promise.resolve(testThumbnailUrl),
    );

    pipe.transform(testPid).then((result) => {
      expect(thumbnailService.getThumbnail).toHaveBeenCalledWith(testPid);
      expect(result).toEqual(testThumbnailUrl);
    });
  });

  it("should return null if getThumbnail fails", async () => {
    const testPid = "test-pid";

    thumbnailService.getThumbnail.and.returnValue(Promise.resolve(null));

    const result = await pipe.transform(testPid);

    expect(result).toBeNull();
  });
});
