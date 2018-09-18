import { Pipe, PipeTransform } from "@angular/core";
import * as filesize from "filesize";

@Pipe({ name: "filesize" })
export class FileSizePipe implements PipeTransform {
  transform(value: string): any {
    return filesize(value || 0);
  }
}
