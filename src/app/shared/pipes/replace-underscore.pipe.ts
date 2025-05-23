import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "replaceUnderscore",
  standalone: false,
})
export class ReplaceUnderscorePipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/_/g, " ") : value;
  }
}
