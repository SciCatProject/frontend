import { Pipe, PipeTransform } from "@angular/core";

import { ThumbnailService } from "shared/services/thumbnail.service";

@Pipe({
  name: "thumbnail",
  pure: true,
  standalone: false,
})
export class ThumbnailPipe implements PipeTransform {
  constructor(private thumbnailService: ThumbnailService) {}

  transform(pid: string): Promise<string | null> {
    return this.thumbnailService.getThumbnail(pid);
  }
}
