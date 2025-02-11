// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

// |||||||||||||||||||||||||||||||||||||| Utils ||||||||||||||||||||||||||||||||||||||||||||||||||
/**
 * check object is null or undefined
 */
export function isNullorUndefined(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  } else {
    return false;
  }
}

/**
 * clone object but reference variable not change
 */
export function clone<T>(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  } else if (Array.isArray(obj)) {
    const array: T[] = [];
    obj.forEach((item) => array.push(Object.assign({}, item)));
    return array;
  } else {
    return Object.assign({}, obj);
  }
}

/**
 * clone object and all reference variable but may be there is a circle loop.
 */
export function deepClone<T>(obj: any) {
  if (obj === null || obj === undefined) {
    return obj;
  } else if (Array.isArray(obj)) {
    const array: T[] = [];
    obj.forEach((item) => array.push(deepClone<typeof item>(item)));
    return array as T[];
  } else {
    const c = Object.assign({} as T, obj);
    const fields: string[] = Object.getOwnPropertyNames(obj);
    fields.forEach((f) => {
      const field = obj[f];
      if (field !== null && typeof field === "object") {
        c[f] = deepClone<typeof field>(field);
      }
    });
    return c;
  }
}

export function getObjectProp(
  fieldName: string,
  defaultValue: any,
  ...variable: any[]
) {
  for (const v in variable) {
    if (variable[v] && !isNullorUndefined(variable[v][fieldName])) {
      return variable[v][fieldName];
    }
  }
  return defaultValue;
}

export function copy(
  from: any,
  to: any,
  forced = false,
  nullSkip = true,
  undefinedSkip = true,
) {
  if (from === null || from === undefined) {
    return;
  }
  if (to === null || to === undefined) {
    to = {};
  }
  const f: string[] = Object.keys(from);
  const t: string[] = Object.keys(to);
  f.forEach((fi) => {
    if (
      (forced === true || t.includes(fi) === true) &&
      !(from[fi] === null && nullSkip === true) &&
      !(from[fi] === undefined && undefinedSkip === true)
    ) {
      to[fi] = from[fi];
    }
  });
}

export interface HashMap<T> {
  [key: string]: T;
}
