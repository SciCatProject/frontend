import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "jsonHead"
})
export class JsonHeadPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
