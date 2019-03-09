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
    let outputString="";
    for (const key of Object.keys(value)) {
      count = count + 1;
      newvalue[key] = value[key];


      if (count > 1) {
        break;
      }
    }
    const key1 = Object.keys(value)[0];
    const key2 = Object.keys(value)[1];
    const val1 = value[key1];
    const val2 = value[key2];
    outputString = key1+":"+val1 +"\n" + key2 + ":" + val2;
    const newvalue2 = JSON.stringify(newvalue, null, 2);
    return outputString;
  }

}
