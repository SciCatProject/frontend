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
      const mimeType = service.base64MimeType(null);
      expect(mimeType).toBeNull();
    });
  });

  describe("getImageUrl", () => {
    it("should return the pdf icon if the file is pdf", () => {
      const encoded = "data:application/pdf;base64,SGVsbG8sIFdvcmxkIQ==";
      const imageUrl = service.getImageUrl(encoded);
      expect(imageUrl).toBe("assets/images/pdf-icon.svg");
    });

    it("should return the encoded string if the file is not pdf", () => {
      const encoded = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
      const imageUrl = service.getImageUrl(encoded);
      expect(imageUrl).toBe(encoded);
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
