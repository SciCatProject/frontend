import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "jsonHead"
})
export class JsonHeadPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) {
      return null;
    }
    const newvalue = {};
    let count = 0;
    let outputString = "";
    for (const key of Object.keys(value)) {
      count = count + 1;
      newvalue[key] = value[key];

      if (count > 1) {
        break;
      }
    }
    const key1 = Object.keys(value)[0];
    const key2 = Object.keys(value)[1];
    let val1 = value[key1];
    if (val1.hasOwnProperty("u")) {
      val1 = val1.v.toString() + " " + val1.u;
    }
    let val2 = " ";
    if (key2 !== undefined) {
      const prop = value[key2];
      if (prop.hasOwnProperty("u")) {
        val2 = prop.v.toString() + " " + prop.u;
      }
    }
    outputString = key1 + ":" + val1 + "\n" + key2 + ":" + val2;
    if (key1 === undefined) {
      outputString = "No metadata found";
    }
    const newvalue2 = JSON.stringify(newvalue, null, 2);
    return outputString;
  }
}
