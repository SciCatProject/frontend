import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

interface IngestorMetadataEvent {
  message: string;
  progress: number;
  result: boolean;
  resultMessage: string;
}

interface ProgressMessage {
  result?: string;
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

  constructor() {}

  public connect(url: string): void {
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      const messageData = event.data;
      this.messageSubject.next({
        message: messageData,
        progress: 0,
        result: false,
        resultMessage: "",
      });
    };

    this.eventSource.addEventListener("progress", (event) => {
      // Decode from base64 and parse JSON
      const encodedData = atob(event.data.replace(/"/g, ""));
      const data = JSON.parse(encodedData) as ProgressMessage;

      const progressMessage = data.std_out.toLowerCase();
      let progress = 0;
      // Check if data contains the string progress
      if (progressMessage.includes("progress")) {
        // extract numbers, point and komma from string using regex
        const extractedNumbers =
          progressMessage.match(/[\d.,]+/g)?.join("") || "0";
        progress = parseFloat(extractedNumbers);
        progress = isNaN(progress) ? 0 : progress;
      }

      this.messageSubject.next({
        message: data.std_out,
        progress: progress,
        result: data.result !== undefined,
        resultMessage: data.result !== undefined ? data.result : "",
      });
      // Check if data contains result then close connection
      if (data.result) {
        this.disconnect();
      }
    });

    this.eventSource.onerror = (error) => {
      console.error("SSE Fehler:", error);
      this.eventSource.close();
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
