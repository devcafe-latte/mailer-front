import { Injectable } from '@angular/core';
import { Serializer } from '../../model/util/Serializer';
import { Serializable } from '../../model/Type';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  static PREFIX = 'trans_';

  constructor() {}

  getItem<T>(key: string, type?: Serializable<T>): T {
    const value = localStorage.getItem(StoreService.PREFIX + key);
    if (!value === null) return null;

    const object = this.tryParse<T>(value);
    if (!type) return object as any;
    if (typeof type.deserialize === 'function') return type.deserialize(object);
    return Serializer.deserialize(type, object);
  }

  setItem<T>(key: string, object: T) {
    const data = Serializer.serialize(object);
    const json = JSON.stringify(data);
    localStorage.setItem(StoreService.PREFIX + key, json);
  }

  removeItem(key: string) {
    localStorage.removeItem(StoreService.PREFIX + key);
  }

  private tryParse<T>(data: string): T | string {
    try {
      return JSON.parse(data);
    } catch (err) {
      return data;
    }
  }
}
