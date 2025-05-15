import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filePathTruncate",
  standalone: false,
})
export class FilePathTruncate implements PipeTransform {
  transform(value: string): string {
    const parts = value.split("/");
    const last = parts[parts.length - 1];
    return last ? last : value;
  }
}
