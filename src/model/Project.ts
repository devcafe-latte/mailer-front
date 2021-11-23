import { DateTime } from 'luxon';
import { Translation } from './Translation';
import { LOCALE_STRING_REGEX, URL_FRIENDLY_REGEX, mergeObjects, sortTranslationObject } from './helpers';
import { Serializer } from './util/Serializer';

export class Project {
  id: number = null;
  name: string = null;
  created: DateTime = null;
  updated: DateTime = null;
  deleted?: DateTime = null;
  defaultLang: string = null;
  defaultEnv: string = null;
  translations: Translation[] = [];

  private _envs: string[] = null;
  get envs(): string[] {
    if (!this._envs) this.setEnvsAndLangs();
    return this._envs;
  }

  private _langs: string[] = null;
  get langs(): string[] {
    if (!this._langs) this.setEnvsAndLangs();
    return this._langs;
  }

  private _versions: number[] = null;
  get versions(): number[] {
    if (!this._versions) this.setEnvsAndLangs();
    return this._versions;
  }

  private setEnvsAndLangs() {
    this._versions = [];
    const envs: any = {};
    const langs: any = {};

    if (this.defaultEnv) envs[this.defaultEnv] = true;
    if (this.defaultLang) langs[this.defaultLang] = true;

    for (let t of this.translations) {
      this.versions.push(t.id);
      envs[t.env] = true;
      langs[t.lang] = true;
    }

    this._envs = Object.keys(envs);
    this._langs = Object.keys(langs);
    this._versions.sort((a, b) => a - b);
  }

  updateTranslation(trans: Translation) {
    const index = this.translations.findIndex(t => trans.id === t.id);
    if (index === -1) {
      this.translations.push(trans);
    } else {
      this.translations[index] = trans;
    }

    //cleanup
    this.setEnvsAndLangs();
  }

  /**
   * Get merged Translation Object
   * 
   *
   * @param {string} [env] defaults to defaultEnv
   * @param {string} [lang] defaults to defaultLang
   * @param {number} [version=Infinity] defaults to latest version
   * @returns {*}
   * @memberof Project
   */
  getObject(env?: string, lang?: string, version: number = Infinity): any {
    if (!env) env = this.defaultEnv;
    if (!lang) lang = this.defaultLang;

    /* 
    Filter based on language, environment and version
    Sort by id (so we merge in the correct order)
    Map to only the object.
     */
    const objects = this.translations
      .filter(t => t.env === env && t.lang === lang && t.id <= version)
      .sort((a, b) => a.id - b.id)
      .map(t => t.object);

    return sortTranslationObject(mergeObjects(objects));
  }

  /**
   * Validates the object and returns errors if any.
   *
   * @returns {string[] | null} An array of error codes, or null if no errors.
   * @memberof Project
   */
  getErrors(): string[] | null {
    const errors = [];

    if (!this.name) errors.push('missing-name');
    if (!this.created) errors.push('missing-created');
    if (!this.updated) errors.push('missing-updated');
    if (!this.defaultEnv) errors.push('missing-defaultEnv');
    if (!this.defaultLang) errors.push('missing-defaultLang');

    if (this.name && !URL_FRIENDLY_REGEX.test(this.name)) errors.push('invalid-name');
    if (this.defaultEnv && !URL_FRIENDLY_REGEX.test(this.defaultEnv)) errors.push('invalid-defaultEnv');
    if (this.defaultLang && !LOCALE_STRING_REGEX.test(this.defaultLang)) errors.push('invalid-defaultLang');

    if (errors.length) return errors;
    return null;
  }

  static deserialize(data: any) {
    const m = {
      created: 'datetime',
      updated: 'datetime',
      deleted: 'datetime',
      translations: (data: any) => data.map(d => Translation.deserialize(d)),
    };

    return Serializer.deserialize(Project, data, m);
  }
}

export interface ProjectPostBody {
  name: string;
  defaultLang: string;
  defaultEnv: string;
}

export interface ProjectPatchBody {
  id: number;
  name?: string;
  defaultLang?: string;
  defaultEnv?: string;
  restore?: boolean;
}

export interface ProjectSearchCriteria {
  name?: string;
  env?: string;
  lang?: string;
  showDeleted?: boolean;

  orderBy?: ProjectOrderBy;
  orderAsc?: boolean;

  page: number;
  perPage: number;
}

export enum ProjectOrderBy {
  NAME = 'name',
  CREATED = 'created',
  UPDATED = 'updated',
}