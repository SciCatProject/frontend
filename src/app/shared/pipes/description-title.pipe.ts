import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "descriptionTitle",
  standalone: false,
})
export class DescriptionTitlePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const titleString = value.split("/").pop();
    return titleString ? titleString.replace("-", " ") : value;
  }
}
