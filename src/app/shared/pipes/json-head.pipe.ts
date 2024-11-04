import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "jsonHead",
})
export class JsonHeadPipe implements PipeTransform {
  transform(value: Record<string, any>, args?: any): any {
    if (!value) {
      return null;
    }
    const newvalue: Record<string, unknown> = {};
    let count = 0;
    let outputString = "";
    for (const key of Object.keys(value)) {
      count = count + 1;
      newvalue[key] = value[key];

      if (count > 1) {
        break;
      }
    }
    const key1 = Object.keys(value).sort()[0];
    let key2 = Object.keys(value).sort()[1];
    let val1 = value[key1];
    if (val1?.unit) {
      val1 = val1.value.toString() + " " + val1.unit;
    }
    let val2 = " ";
    if (key2 !== undefined) {
      const prop = value[key2];
      if (prop?.unit) {
        val2 = prop.value.toString() + " " + prop.unit;
      }
    } else {
      key2 = " ";
      val2 = " ";
    }
    outputString =
      key1 + ":" + (val1?.value?.toString() || val1) + "\n" + key2 + ":" + val2;
    if (key1 === undefined) {
      outputString = "No metadata found";
    }
    return outputString.slice(0, 100);
  }
}
