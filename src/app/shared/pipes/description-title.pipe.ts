import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "descriptionTitle",
})
export class DescriptionTitlePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return value.split("/").pop().replace("-", " ");
  }
}
