import { Pipe, PipeTransform } from "@angular/core";

import { DatasetAttachmentApi, DatasetAttachment, DatasetApi, Dataset } from "shared/sdk";

@Pipe({
  name: "thumbnail"
})
export class ThumbnailPipe implements PipeTransform {
  attach: string;
  constructor(
    private ds: DatasetApi,
    private da: DatasetAttachmentApi) { }

  transform(value: any, args?: any): any {
    return this.ds.thumbnail(encodeURIComponent(value));
  }
}
