import { mergeObjects, sortTranslationObject, getTranslationDelta } from './helpers';

describe("helpers", () => {

  test("composite ojects", async () => {
    const o1 = {
      "foo": "bar",
      "name": "Jim",
      "skills": {
        "piano": {
          "level": 1,
          "excitement": 1
        },
        "guitar": {
          "level": 0,
          "excitement": -1
        }
      }
    };
    const o2 = {
      "name": "Jack",
      "age": 12,
      "skills": {
        "piano": {
          "level": 2,
          "excitement": 1
        },
        "guitar": {}
      }
    };

    const expected = {
      "foo": "bar",
      "name": "Jack",
      "age": 12,
      "skills": {
        "piano": {
          "level": 2,
          "excitement": 1
        },
        "guitar": {
          "level": 0,
          "excitement": -1
        }
      }
    };

    const result = mergeObjects([o1, o2]);
    expect(result).toEqual(expected);
  });

});

describe("Sorting Objects", () => {
  test("a non-object", () => {
    expect(sortTranslationObject(true)).toBe(true);
    expect(sortTranslationObject(55)).toBe(55);
    expect(sortTranslationObject("fred")).toBe("fred");
  });

  test("a simple array", () => {
    //Should not be touched.
    expect(sortTranslationObject([1, 7, 5, 3, 9, 11])).toEqual([1, 7, 5, 3, 9, 11]);
  });

  test("an object", () => {
    const obj = {
      zebra: 'foo',
      carrot: 'foo',
      apple: {
        matt: 'knor',
        anne: 'clump',
      },
      bear: true,
    };

    //First level
    const ordered: any = sortTranslationObject(obj);
    const orderedKeys = Object.keys(ordered);
    expect(orderedKeys[0]).toBe('bear');
    expect(orderedKeys[1]).toBe('carrot');
    expect(orderedKeys[2]).toBe('zebra');
    expect(orderedKeys[3]).toBe('apple');

    //recursive
    const appleKeys = Object.keys(ordered.apple);
    expect(appleKeys[0]).toBe('anne');
    expect(appleKeys[1]).toBe('matt');

    //Even tho the order is off, technically it's still an equal object.
    expect(ordered).toEqual(obj);
  });
});

describe("Getting Deltas", () => {

  test("basic values", () => {
    //If the value is different, get the new value.
    expect(getTranslationDelta("foo", "bar")).toBe("bar");

    //If the value is the same, we shouldn't save it, so it should be removed.
    expect(getTranslationDelta("foo", "foo")).toBe(undefined);

    expect(getTranslationDelta(true, true)).toBe(undefined);
    expect(getTranslationDelta(true, false)).toBe(false);
    expect(getTranslationDelta(false, true)).toBe(true);
  });

  test("Array values", () => {
    expect(getTranslationDelta([1, 2, 3], [1, 2, 3])).toBe(undefined);
    expect(getTranslationDelta([1, 2, 3], [1, 3, 2])).toEqual([1, 3, 2]);
    expect(getTranslationDelta([1, 2, 3], [1, 2])).toEqual([1, 2]);
    expect(getTranslationDelta([1, 2], [1, 2, 3])).toEqual([1, 2, 3]);
  });

  test("shallow objects", () => {
    const a = {
      foo: 'bar',
      age: 10,
    };

    const b = {
      foo: 'bar',
      age: 12,
      knop: true
    }

    const expected = {
      foo: undefined,
      age: 12,
      knop: true,
    };

    expect(getTranslationDelta(a, b)).toEqual(expected);
  });

  test("deep objects", () => {
    const a: any = {
      foo: 'bar',
      age: 10,
      values: [1, 2, 3],
      monk: { foo: true },
    };

    const b: any = {
      foo: 'bar',
      knop: true,
      monk: { foo: true },
      age: 12,
      values: [1, 2, 3],
    }

    const expected: any = {
      foo: undefined,
      age: 12,
      knop: true,
      monk: undefined,
      values: undefined,
    };

    const result = getTranslationDelta(a, b);
    expect(result).toEqual(expected);

    b.monk.baz = 123;
    expected.monk = { foo: undefined, baz: 123 };

    const result2 = getTranslationDelta(a, b);
    expect(result2).toEqual(expected);
  });

  test("Weird structures", () => {
    const a: any = {
      foo: 'bar',
      age: 10,
      values: null,
      monk: 1,
      plopsa: 'doo'
    };

    const b: any = {
      foo: 'bar',
      knop: true,
      monk: { foo: true },
      age: 12,
      values: [1, 2, 3],
      plopsa: { foo: 1 },
      new: { foo: 2 },
    }

    const expected: any = {
      foo: undefined,
      age: 12,
      knop: true,
      monk: { foo: true },
      values: [1, 2, 3],
      plopsa: { foo: 1 },
      new: { foo: 2 },
    };

    const result = getTranslationDelta(a, b);
    expect(result).toEqual(expected);
  });
});