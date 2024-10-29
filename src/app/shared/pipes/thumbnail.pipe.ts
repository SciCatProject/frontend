import { Pipe, PipeTransform } from "@angular/core";
import { DatasetsService } from "@scicatproject/scicat-sdk-ts";

@Pipe({
  name: "thumbnail",
})
export class ThumbnailPipe implements PipeTransform {
  constructor(private datasetsService: DatasetsService) {}

  async transform(pid: string, args?: any): Promise<string | null> {
    const encodedPid = encodeURIComponent(pid);

    const res = await this.datasetsService
      .datasetsControllerThumbnail(encodedPid)
      .toPromise();

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
