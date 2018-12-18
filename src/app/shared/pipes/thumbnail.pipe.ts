import { Pipe, PipeTransform } from "@angular/core";

import {
  DatasetAttachmentApi,
  DatasetAttachment,
  DatasetApi,
  Dataset
} from "shared/sdk";
import { datasets } from "state-management/selectors";

@Pipe({
  name: "thumbnail"
})
export class ThumbnailPipe implements PipeTransform {
  attach: string;
  constructor(private ds: DatasetApi, private da: DatasetAttachmentApi) {}

  transform(value: any, args?: any): any {
    const encoded = encodeURIComponent(value);
    const filter = {
      where: {
        datasetId: value
      }
    };

    return this.ds.thumbnail(encoded);
  }
}
