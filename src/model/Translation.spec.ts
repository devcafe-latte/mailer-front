import { DateTime } from "luxon";
import { Translation, TranslationPutBody } from './Translation';

describe("Translation", () => {
  test("Validating missing fields", () => {
    const t = new Translation();
    let errors: string[];

    errors = t.getErrors();
    expect(errors.length).toBe(6);

    t.lang = 'nl';
    t.env = 'dev';
    t.created = DateTime.now();
    t.updated = DateTime.now();
    t.projectId = 1;

    errors = t.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('missing-object');
  });

  test("Validating invalid values", () => {
    let errors: string[];
    const t = new Translation();
    t.projectId = 1;
    t.object = {};
    t.updated = DateTime.now();
    t.created = DateTime.now();
    t.lang = 'nl';
    t.env = 'dev!!!!!';

    errors = t.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('invalid-env');

    t.env = 'dev';
    t.lang = 'mufasa';
    errors = t.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('invalid-lang');

    t.lang = 'nl'
    errors = t.getErrors();
    expect(errors).toBeNull();
  });
});