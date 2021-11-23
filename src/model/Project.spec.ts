import { DateTime } from "luxon";
import { Project } from './Project';
import { Translation } from "./Translation";

describe("Get Objects From Project", () => {
  let p: Project;
  beforeEach(() => {
    p = new Project();
    p.translations.push(new Translation());
    p.translations.push(new Translation());

    p.translations[0].id = 1;
    p.translations[0].env = "test";
    p.translations[0].lang = "en";
    p.translations[0].object = { foo: 'version 1' };
    p.translations[1].id = 50;
    p.translations[1].env = "test";
    p.translations[1].lang = "en";
    p.translations[1].object = { foo: 'version 2' };
  });

  test("Get objects normally", () => {
    const result = p.getObject('test', 'en');
    expect(result.foo).toBe("version 2");

    expect(p.getObject('test', 'de')).toEqual({});
    expect(p.getObject('prod', 'en')).toEqual({});
  });

  test("Get objects ordered wrong", () => {
    p.translations[0].id = 100;
    const result = p.getObject('test', 'en');
    expect(result.foo).toBe("version 1");
  });

  test("Get objects change env", () => {
    p.translations[1].env = "prod";
    const result = p.getObject('test', 'en');
    expect(result.foo).toBe("version 1");
  });

  test("Get objects change lang", () => {
    p.translations[1].lang = "de";
    const result = p.getObject('test', 'en');
    expect(result.foo).toBe("version 1");
  });

  test("Get objects Version", () => {
    const result = p.getObject('test', 'en', 20);
    expect(result.foo).toBe("version 1");
  });
});

describe("Project", () => {

  test("envs and langs", () => {
    const p = new Project();
    p.translations.push(new Translation());
    p.translations.push(new Translation());

    p.translations[0].env = "test";
    p.translations[1].env = "prod";

    expect(p.envs).toEqual(['test', 'prod']);
  });

  test("Validating missing fields", () => {
    const p = new Project();
    let errors: string[];

    errors = p.getErrors();
    expect(errors.length).toBe(5);

    p.name = "foo";
    p.defaultLang = 'nl';
    p.defaultEnv = 'dev';
    p.created = DateTime.now();

    errors = p.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('missing-updated');
  });

  test("Validating invalid values", () => {
    let errors: string[];
    const p = new Project();
    p.name = "foo!";
    p.updated = DateTime.now();
    p.created = DateTime.now();
    p.defaultLang = 'nl';
    p.defaultEnv = 'dev';

    errors = p.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('invalid-name');

    p.name = 'foo';
    p.defaultLang = 'mufasa'
    errors = p.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('invalid-defaultLang');

    p.defaultLang = 'en'
    p.defaultEnv = 'bar!'
    errors = p.getErrors();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('invalid-defaultEnv');

    p.defaultEnv = 'bar'
    errors = p.getErrors();
    expect(errors).toBeNull();
  });
});