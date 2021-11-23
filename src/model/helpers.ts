import { merge } from 'lodash-es';
import * as YAML from 'yaml';

/**
 * Tries to find an Error message, up to 20 objects deep.
 *
 * @export
 * @param {*} ex
 * @param {number} [i=0]
 * @returns {string} The error message.
 */
export function getErrorMessage(ex: any, i: number = 0): string {
  if (i > 20) return 'unknown error - message too deep';

  if (typeof ex === "string") return ex;

  if (ex.error) return getErrorMessage(ex.error, i + 1);
  if (ex.message) return ex.message;
  if (ex.code) return ex.code;

  return String(ex);
}

/**
 * Tries to find an Error message, up to 20 objects deep.
 *
 * @export
 * @param {*} ex
 * @param {number} [i=0]
 * @returns {string} The error message.
 */
export function getErrorData(ex: any, i: number = 0): string {
  if (i > 20) return 'unknown error - message too deep';

  if (typeof ex === "string") return ex;

  if (ex.error) return getErrorData(ex.error, i + 1);
  if (ex.data) return ex.data;

  return null;
}

/**
 * Check if an object has properties.
 * Commonly used to check if the Post Body has what we need.
 *
 * @export
 * @param {*} object
 * @param {string[]} properties
 * @returns {boolean}
 */
export function hasProperties(object: any, properties: string[]): boolean {
  if (object === null || typeof object !== "object") return false;

  for (let p of properties) {
    if (object[p] === undefined || object[p] === null) return false;
  }

  return true;
}

/**
 * Merge multiple objects into on. Does not mutate any of the input objects.
 *
 * @export
 * @param {Object[]} translations
 * @returns {Object} The merged result.
 */
export function mergeObjects(translations: Object[]): Object {
  let result = {}
  for (let t of translations) {
    if (!t) continue;
    if (typeof t !== "object") return t;

    merge(result, t);
  }

  return result;
}

/**
 * Get all new and updated values, while stripping values that are the same in the original.
 * 
 *
 * @export
 * @param {*} original
 * @param {*} newObject
 * @param {number} depth Recursive depth
 * @returns {*}
 */
export function getTranslationDelta(original: any, newObject: any, depth = 0): any {
  if (depth > 100) throw "It's too deep";

  //If they are strictly the same, value should be omitted.
  if (newObject === original) return undefined;

  if (newObject === null || newObject == undefined) return newObject;
  if (typeof newObject !== "object") return newObject;

  if (original === null || original == undefined) return newObject;

  if (Array.isArray(newObject)) {
    //If any value in the array is different than the original:
    //  Keep the entire array
    //else: return undefined.

    //If original isn't an array, clearly the value has changed.
    if (!Array.isArray(original)) return newObject;

    //If the lengths are different, value has changed.
    if (original.length !== newObject.length) return newObject;
    
    for (let i = 0; i < newObject.length; i++) {
      const result = getTranslationDelta(original[i], newObject[i], depth + 1);
      if (result !== undefined) return newObject;
    }
    return undefined;

  } else {
    //Do some object stuff.
    let result = {};
    let anyChanges = false;

    Object.keys(newObject)
      .forEach(key => {
        result[key] = getTranslationDelta(original[key], newObject[key], depth + 1);
        if (result[key] !== undefined) anyChanges = true;
      });
    
    if (!anyChanges) return undefined;
    return result;
  }

}

export function parseJsonOrYaml(input: string) {
  try {
    return JSON.parse(input);
  } catch (err) {

    try {
      return YAML.parse(input);
    } catch (err) {
      throw "Neither JSON nor YAML";
    }
  }

}

/**
 * Sort object keys
 * Leaf nodes will be placed above branches. 
 * Arrays will be left untouched
 * Everything else is alphabetically sorted
 *
 * @export
 * @param {Object} object
 * @returns {Object} The sorted result.
 */
export function sortTranslationObject(object: any, depth = 0): any {
  if (depth > 100) throw "It's too deep";

  if (object === null || object == undefined) return object;
  if (typeof object !== "object") return object;

  if (Array.isArray(object)) {
    //Don't touch arrays. Their order is important.
    return object;
  } else {
    //Do some object stuff.
    let result = {};

    Object.keys(object)
      .sort((a, b) => {
        const valA = `${typeof object[a] === "object" ? 1 : 0}-${a}`;
        const valB = `${typeof object[b] === "object" ? 1 : 0}-${b}`;
        return valA.localeCompare(valB);
      })
      .forEach(key => {
        result[key] = sortTranslationObject(object[key], depth + 1);
      });
    return result;
  }


}

/**
 * Convert a string value to a bool value.
 * Values "0", "false" and "no" are interpreted as false. 
 * Values null and undefined will return the default value.
 * Any other value returns as true.
 *
 * @export
 * @param {string} value
 * @param {boolean} [defaultValue=false]
 * @returns {boolean}
 */
export function stringToBool(value: string, defaultValue: boolean = false): boolean {
  if (value === "0" || value === "false" || value === "no") return false;
  if (value === null || value === undefined) return defaultValue;
  return true;
}

/**
 * Regex to check whether a string is url-friendly.
 * Allowed characters are: letters, numbers, dashes[-] and underscores[_]
 */
export const URL_FRIENDLY_REGEX = /^[\w\-_]+$/;

/**
 * Regex to check for valid locale strings according to ISO 639, 15924 and 3166-1
 * https://stackoverflow.com/a/48300605/1686932
 */
export const LOCALE_STRING_REGEX = /^[A-Za-z]{2,4}([_-][A-Za-z]{4})?([_-]([A-Za-z]{2}|[0-9]{3}))?$/;

export function toQueryParams(obj: any, prefix?: string): string[] {
  if (!prefix) prefix = '';
  const params = [];
  for (let p of Object.getOwnPropertyNames(obj)) {
    if (obj[p] === null || obj[p] === undefined) continue;
    const result = toQueryParam(p, obj[p], prefix);
    if (result !== null) params.push(result);
  }
  return params;
}

function toQueryParam(name: string, value: any, prefix = ''): string {
  if (Array.isArray(value)) {
    const params = [];
    for (let v of value) {
      const p = toQueryParam(name, v, prefix);
      if (p !== null) params.push(p);
    }
    if (params.length === 0) return null;
    return params.join("&");
  } else if (typeof value === "object" && typeof value.unix === "function") {
    return `${prefix}${name}=${value.unix()}`;
  } else if (value === null || value === undefined) {
    return null;
  } else if (typeof value === "object") {
    return null;
  } else if (typeof value === "boolean") {
    return `${prefix}${name}=${value ? 'true' : 'false'}`;
  } else {
    return `${prefix}${name}=${encodeURIComponent(value)}`;
  }

}