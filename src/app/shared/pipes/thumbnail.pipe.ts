import { Pipe, PipeTransform } from "@angular/core";

import { DatasetApi } from "shared/sdk";

@Pipe({
  name: "thumbnail",
})
export class ThumbnailPipe implements PipeTransform {
  constructor(private datasetApi: DatasetApi) {}

  async transform(pid: string, args?: any): Promise<string | null> {
    const encodedPid = encodeURIComponent(pid);

    const res = await this.datasetApi.thumbnail(encodedPid).toPromise();

    if (!res) {
      return null;
    }

    if (typeof res === "string") {
      return res;
    }

    if (!res.thumbnail) {
      return null;
    }

    return res.thumbnail;
  }
}
