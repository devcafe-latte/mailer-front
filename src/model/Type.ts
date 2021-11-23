/**
 * Any instantiable class
 *
 * @interface Type
 * @template T
 */
export interface Type<T> {
  new (): T;
}

/**
 * Any class with a `deserialize` function
 *
 * @interface Serializable
 * @extends {Type<T>}
 * @template T
 */
export interface Serializable<T> extends Type<T> {
  deserialize: (data: unknown) => T;
}
