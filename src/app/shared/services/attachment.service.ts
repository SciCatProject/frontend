import { Injectable } from "@angular/core";

@Injectable()
export class AttachmentService {
  private readonly pdfIcon = "assets/images/pdf-icon.svg";
  private readonly txtIcon = "assets/images/txt-icon.svg";
  private readonly pythonIcon = "assets/images/python-icon.svg";
  private readonly unknownFileIcon = "assets/images/unknown-file-icon.svg";
  base64MimeType(encoded: string): string {
    if (!encoded) {
      return null;
    }

    let result = null;

    if (typeof encoded !== "string") {
      return result;
    }

    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  }

  getImageUrl(encoded: string) {
    if (!encoded) {
      return null;
    }

    const mimeType = this.base64MimeType(encoded);

    if (mimeType?.startsWith("image/")) {
      return encoded;
    }

    switch (mimeType) {
      case "application/pdf":
        return this.pdfIcon;
      case "text/plain":
        return this.txtIcon;
      case "text/x-python":
      case "application/x-python":
        return this.pythonIcon;
      default:
        return this.unknownFileIcon;
    }
  }

  getUnknownFileIcon(): string {
    return this.unknownFileIcon;
  }

  openAttachment(encoded: string) {
    if (!encoded) {
      return null;
    }

    const mimeType = this.base64MimeType(encoded);
    const strippedData = encoded.replace(
      new RegExp(`^data:${mimeType};base64,`),
      "",
    );

    const blob = new Blob(
      [Uint8Array.from(atob(strippedData), (c) => c.charCodeAt(0))],
      { type: mimeType },
    );
    const objectUrl = URL.createObjectURL(blob);

    window.open(objectUrl);
    URL.revokeObjectURL(objectUrl);
  }
}
