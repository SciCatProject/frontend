import { TestBed } from "@angular/core/testing";
import { AttachmentService } from "./attachment.service";

describe("AttachmentService", () => {
  let service: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachmentService],
    });
    service = TestBed.inject(AttachmentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("base64MimeType", () => {
    it("should return the correct mime type", () => {
      const encoded = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
      const mimeType = service.base64MimeType(encoded);
      expect(mimeType).toBe("image/png");
    });

    it("should return null for invalid input", () => {
      const encoded = "invalid data";
      const mimeType = service.base64MimeType(encoded);
      expect(mimeType).toBeNull();
    });

    it("should return null for non-string input", () => {
      const mimeType = service.base64MimeType(null as any);
      expect(mimeType).toBeNull();
    });
  });

  describe("openAttachment", () => {
    it("should open a new window with the correct object URL", () => {
      const encoded = "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==";
      const spyWindowOpen = spyOn(window, "open");
      const spyRevokeObjectURL = spyOn(URL, "revokeObjectURL");

      service.openAttachment(encoded);

      expect(spyWindowOpen).toHaveBeenCalled();
      expect(spyRevokeObjectURL).toHaveBeenCalled();
    });
  });
});
