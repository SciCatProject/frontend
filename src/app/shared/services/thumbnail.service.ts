import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { distinctUntilChanged, firstValueFrom } from "rxjs";
import { DatasetApi } from "shared/sdk";
import { selectDatasetsPerPage } from "state-management/selectors/datasets.selectors";

@Injectable({
  providedIn: "root",
})
export class ThumbnailService {
  private thumbnailCache: { [pid: string]: string | null } = {};
  private datasetsPerPage: number | null = null;

  constructor(
    private datasetApi: DatasetApi,
    private store: Store,
  ) {
    this.store
      .select(selectDatasetsPerPage)
      .pipe(
        distinctUntilChanged(), // Only proceed on actual changes
      )
      .subscribe((datasetsPerPage) => (this.datasetsPerPage = datasetsPerPage));
  }

  async getThumbnail(pid: string): Promise<string | null> {
    // if the number of datasets per page is over 100, don't fetch thumbnails
    if (!this.datasetsPerPage || this.datasetsPerPage > 100) {
      return null;
    }

    // Return cached value if available
    // And return null if already fetched and not found
    if (this.thumbnailCache[pid]) {
      return this.thumbnailCache[pid];
    } else if (this.thumbnailCache[pid] === null) {
      return null;
    }

    try {
      const encodedPid = encodeURIComponent(pid);
      const res = await firstValueFrom(this.datasetApi.thumbnail(encodedPid));
      this.thumbnailCache[pid] = res?.thumbnail || null; // Cache the result
      return this.thumbnailCache[pid];
    } catch (error) {
      console.error(`Failed to fetch thumbnail for PID: ${pid}`, error);
      this.thumbnailCache[pid] = null; // Cache null for failed request
      return null;
    }
  }
}
