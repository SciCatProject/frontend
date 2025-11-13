import { Pipe, PipeTransform } from "@angular/core";
import { filesize } from "filesize";

@Pipe({
  name: "filesize",
  standalone: false,
})
export class FileSizePipe implements PipeTransform {
  transform(value: number): any {
    return filesize(value || 0, { round: 0, base: 2 });
  }
}
