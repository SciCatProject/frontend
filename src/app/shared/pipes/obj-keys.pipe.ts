import { Pipe, PipeTransform } from "@angular/core";

/**
 * A class to iterate over the keys in an object
 * and return an array
 * @export
 * @class ObjKeysPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: "objKeys"
})
export class ObjKeysPipe implements PipeTransform {
  /**
   * Takes an object and returns an array containing a key and a value
   * for all items
   * @param {any} value - the object to iterate over
   * @param {string[]} args -arguments
   * @returns {*} - array with key value
   * @memberof ObjKeysPipe
   */
  transform(value, args: string[]): any {
    if (!value) {
      return value;
    }

    const keys = [];
    for (const key in value) {
      if (key) {
        keys.push({ key: key, value: value[key] });
      }
    }
    return keys;
  }
}
