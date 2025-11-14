import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { decodeBase64ToUTF8, isBase64 } from "./ingestor.component-helper";

interface IngestorMetadataEvent {
  message: string;
  progress: number;
  result: boolean;
  resultMessage: string;
  error: boolean;
}

interface ProgressMessage {
  result?: string;
  err?: string;
  std_err: string;
  std_out: string;
}

@Injectable({
  providedIn: "root",
})
export class IngestorMetadataSSEService {
  private eventSource: EventSource;
  private messageSubject: Subject<IngestorMetadataEvent> =
    new Subject<IngestorMetadataEvent>();

  constructor() {
    // Close previous connection if it exists
    this.disconnect();
  }

  destroy(): void {
    this.disconnect();
  }

  public connect(url: string, withCredentials = true): void {
    // Close previous connection if it exists
    this.disconnect();

    this.eventSource = new EventSource(url, { withCredentials });

    this.eventSource.onmessage = (event) => {
      const messageData = event.data;
      this.messageSubject.next({
        message: messageData,
        progress: 0,
        result: false,
        resultMessage: "",
        error: false,
      });
    };

    this.eventSource.addEventListener("progress", (event) => {
      // Decode from base64 and parse JSON
      // Check if event is a valid base64 string

      let eventData = event.data;
      if (isBase64(event.data.replace(/"/g, ""))) {
        eventData = decodeBase64ToUTF8(event.data.replace(/"/g, ""));
      }

      const data = JSON.parse(eventData) as ProgressMessage;

      const progressMessage = data.std_out.toLowerCase();
      let progress = 0;
      // Check if the string "progress" is present in the message
      if (progressMessage.includes("progress")) {
        // Find all occurrences of "progress" followed by a number, use the last one
        const progressRegex = /progress[^\d]*(?<number>[\d.,]+)/gi;
        let match: RegExpExecArray | null;
        let lastNumber = "0";
        while ((match = progressRegex.exec(progressMessage)) !== null) {
          if (match.groups?.number) {
            lastNumber = match.groups.number;
          }
        }

        progress = parseFloat(lastNumber.replace(",", "."));
        progress = isNaN(progress) ? 0 : progress;
      }

      this.messageSubject.next({
        message: data.err ?? data.std_out,
        progress: progress,
        result: data.result !== undefined,
        resultMessage: data.result !== undefined ? data.result : "",
        error: data.err !== undefined,
      });
      // Check if data contains result then close connection
      if (data.result || data.err !== undefined) {
        this.disconnect();
      }
    });

    this.eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      this.eventSource.close();
      this.messageSubject.next({
        message: "An error occurred while extracting metadata.",
        progress: 0,
        result: false,
        resultMessage: "",
        error: true,
      });
    };
  }

  public getMessages(): Subject<IngestorMetadataEvent> {
    return this.messageSubject;
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
