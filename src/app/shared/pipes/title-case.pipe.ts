import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "titleCase",
  standalone: false,
})
export class TitleCasePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const components = value.split(/(?=[A-Z])/);
    for (let i = 0; i < components.length; i++) {
      components[i] =
        components[i].charAt(0).toUpperCase() +
        components[i].slice(1).toLowerCase();
    }
    return components.join(" ");
  }
}
