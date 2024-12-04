import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { distinctUntilChanged, firstValueFrom } from "rxjs";
import { selectDatasetsPerPage } from "state-management/selectors/datasets.selectors";
import { AppConfigService } from "app-config.service";
import { DatasetsService } from "@scicatproject/scicat-sdk-ts";
import { AttachmentService } from "./attachment.service";

interface ThumbnailCache {
  [pid: string]: {
    value: string | null;
    timestamp: number;
    isError: boolean;
  };
}

@Injectable({
  providedIn: "root",
})
export class ThumbnailService {
  private thumbnailCache: ThumbnailCache = {};
  private datasetsPerPage: number;
  private thumbnailFetchLimitPerPage: number;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(
    private datasetApi: DatasetsService,
    private store: Store,
    private attachmentService: AttachmentService,
    private appConfigService: AppConfigService,
  ) {
    this.store
      .select(selectDatasetsPerPage)
      .pipe(
        distinctUntilChanged(), // Only proceed on actual changes
      )
      .subscribe((datasetsPerPage) => (this.datasetsPerPage = datasetsPerPage));

    this.thumbnailFetchLimitPerPage =
      this.appConfigService.getConfig().thumbnailFetchLimitPerPage || 100;
  }

  async getThumbnail(pid: string): Promise<string | null> {
    // If the number of datasets per page is over the value of thumbnailFetchLimitPerPage, don't fetch thumbnails
    if (this.datasetsPerPage > this.thumbnailFetchLimitPerPage) {
      return null;
    }

    const cachedThumbnail = this.thumbnailCache[pid];

    // Check if the cached entry exists and has not expired
    if (cachedThumbnail) {
      const isExpired =
        Date.now() - cachedThumbnail.timestamp > this.cacheTimeout;
      if (!isExpired) {
        return cachedThumbnail.value;
      } else {
        delete this.thumbnailCache[pid];
      }
    }

    try {
      const res = await firstValueFrom(
        this.datasetApi.datasetsControllerThumbnail(pid),
      );
      const thumbnail = this.attachmentService.getImageUrl(res?.thumbnail);

      this.thumbnailCache[pid] = {
        value: thumbnail,
        timestamp: Date.now(),
        isError: !thumbnail,
      };
      return thumbnail;
    } catch (error) {
      console.error(`Failed to fetch thumbnail for PID: ${pid}`, error);
      this.thumbnailCache[pid] = {
        value: null,
        timestamp: Date.now(),
        isError: true,
      };
      return null;
    }
  }
}
