import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "scientificMetadata"
})
export class ScientificMetadataPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) {
      return null;
    }
    const newvalue = {};
    let count = 0;
    for (const key of Object.keys(value)) {
      count = count + 1;
      newvalue[key] = value[key];
      if (count > 1) {
        break;
      }
    }
    const newvalue2 = JSON.stringify(newvalue, null, 2);
    const obj = {
      dates: {
        d1: "2011-10-05T14:48:00.000Z" ,
        d2: "2011-10-05T14:48:00.000Z" ,
      },
      units: {
        speed: { u: "Hz", v: "14" },
        speed2: { u: "Hz", v: "14" }
      },
      objs: {
        obja: {
          prop1: "12"
        }
      }
    };
    return newvalue2;
  }
}
