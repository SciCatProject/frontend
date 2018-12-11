import { Pipe, PipeTransform } from "@angular/core";

import { DatasetAttachmentApi, DatasetAttachment } from "shared/sdk";

@Pipe({
  name: "thumbnail"
})
export class ThumbnailPipe implements PipeTransform {
  attach: string;
  constructor(private da: DatasetAttachmentApi) {}

  transform(value: any, args?: any): any {
    const attach = this.da
      .findById("xx")
      .subscribe((data: DatasetAttachment) => {
        this.attach = data.thumbnail;
        console.log("gm attach", this.attach);
      });
    return this.attach;
  }
}
