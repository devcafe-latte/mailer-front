import { DateTime } from 'luxon';

import { LOCALE_STRING_REGEX, URL_FRIENDLY_REGEX } from './helpers';
import { Serializer } from './util/Serializer';

export class Translation {
  id: number = null;
  projectId: number = null;
  
  created: DateTime = null;
  updated: DateTime = null;
  deleted?: DateTime = null;
  
  lang: string = null;
  env: string = null;
  
  object: any = null;
  slice?: any = null;

  /**
   * Validates the object and returns errors if any.
   *
   * @returns {string[] | null} An array of error codes, or null if no errors.
   * @memberof Project
   */
   getErrors(): string[] | null {
    const errors = [];

    if (!this.projectId) errors.push('missing-projectId');
    if (!this.created) errors.push('missing-created');
    if (!this.updated) errors.push('missing-updated');
    if (!this.env) errors.push('missing-env');
    if (!this.lang) errors.push('missing-lang');
    if (!this.object) errors.push('missing-object');

    if (this.env && !URL_FRIENDLY_REGEX.test(this.env)) errors.push('invalid-env');
    if (this.lang && !LOCALE_STRING_REGEX.test(this.lang)) errors.push('invalid-lang');

    if (errors.length) return errors;
    return null;
  }

  static deserialize(data: any) {
    const m = {
      created: 'datetime',
      updated: 'datetime',
      deleted: 'datetime',
      object: (data: any) => data,
    };

    return Serializer.deserialize(Translation, data, m);
  }
}


export interface TranslationBody {
  lang?: string;
  env?: string;
  object: any;
}

export interface TranslationPostBody {
  lang: string;
  env: string;
  object: any;
  projectId: number;
}

export interface TranslationPutBody {
  id: number;
  lang: string;
  env: string;
  object: any;
  restore?: boolean;
}

export interface TranslationPatchBody {
  id: number;
  restore?: boolean;
  lang?: string;
  env?: string;
  object?: any;
}