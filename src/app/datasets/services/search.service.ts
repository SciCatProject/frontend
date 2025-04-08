import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private worker: Worker | null = null;

  constructor() {
    // Initialize the worker if Web Workers are supported
    if (typeof Worker !== "undefined") {
      this.initWorker();
    }
  }

  private initWorker(): void {
    try {
      this.worker = new Worker(new URL("./search.worker.ts", import.meta.url), {
        type: "module",
      });
    } catch (error) {
      console.error("Error initializing search worker:", error);
      this.worker = null;
    }
  }

  /**
   * Fallback search method that runs in the main thread but
   * uses small chunks to avoid blocking the UI for too long
   */
  private async searchInChunks(
    files: any[],
    searchTerm: string,
    filters: Record<string, string>,
    observer: any,
  ): Promise<void> {
    const CHUNK_SIZE = 100; // Smaller chunks for better responsiveness
    const results: any[] = [];

    // Process in small chunks with yielding to UI thread
    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
      // Yield to UI thread between chunks
      await new Promise((resolve) => setTimeout(resolve, 0));

      const chunk = files.slice(i, i + CHUNK_SIZE);

      // Search in this chunk
      const matchingInChunk = chunk.filter((file) =>
        file.numor.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      // Apply filters
      const filteredInChunk = matchingInChunk.filter((file) => {
        for (const [key, value] of Object.entries(filters)) {
          if (file[key] !== value) {
            return false;
          }
        }
        return true;
      });

      results.push(...filteredInChunk);

      // Emit intermediate results for better feedback
      observer.next(results);
    }

    observer.complete();
  }

  /**
   * Search for files matching the search term using a Web Worker if available
   * Falls back to main thread search if Web Workers aren't supported
   */
  searchFiles(
    files: any[],
    searchTerm: string,
    filters: Record<string, string> = {},
  ): Observable<any[]> {
    return new Observable((observer) => {
      if (this.worker) {
        // Use Web Worker for search (non-blocking)
        const messageHandler = (event: MessageEvent) => {
          observer.next(event.data.matchingFiles);
          observer.complete();
        };

        this.worker.onmessage = messageHandler;
        this.worker.postMessage({ files, searchTerm, filters });

        return () => {
          this.worker!.removeEventListener("message", messageHandler);
        };
      } else {
        // Fallback to main thread search with chunking
        this.searchInChunks(files, searchTerm, filters, observer);

        return () => {
          // Cleanup
        };
      }
    });
  }
}
