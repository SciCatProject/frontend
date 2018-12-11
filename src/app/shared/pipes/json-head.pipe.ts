import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "jsonHead"
})
export class JsonHeadPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    const newvalue = {};
    let count = 0;
    for (const key of Object.keys(value)) {
      count = count + 1;
      newvalue[key] = value[key];
      if (count > 0) {
        break;
      }
    }
    const newvalue2 = JSON.stringify(newvalue, null, 2);
    return newvalue2;
  }

}
