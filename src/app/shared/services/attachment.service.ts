import { Injectable } from "@angular/core";

@Injectable()
export class AttachmentService {
  base64MimeType(encoded: string): string {
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
  openAttachment(encoded: string) {
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
