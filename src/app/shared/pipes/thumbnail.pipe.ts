import { Pipe, PipeTransform } from "@angular/core";

import { DatasetApi } from "shared/sdk";

@Pipe({
  name: "thumbnail"
})
export class ThumbnailPipe implements PipeTransform {
  attach: string;
  constructor(private datasetApi: DatasetApi) {}

  transform(value: any, args?: any): any {
    const encoded = encodeURIComponent(value);

    return this.datasetApi.thumbnail(encoded);
  }
}
