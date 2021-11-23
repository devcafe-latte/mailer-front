import { TreeHelper } from './TreeHelper';

describe("Building", () => {

  const testObjectEn = {
    "name": "Form 1 - Tis but a scratch",
    "knights-title": "The Knights of Ni",
    "questions": {
      "name": "What is your name?",
      "quest": "What is your quest?",
      "favorite-colour": "What is your favorite color?",
      "laden-swallow-speed": "What is the average air speed velocity of a laden swallow?"
    },
    pages: {
      title: "Pages Overview",
      dashboard: {
        "title": "The Dashboard",
        "content": "There is content"
      },
      review: {
        "title": "The Review page",
        "content": "There is content here too"
      }

    }
  };

  const testObjectDe = {
    "name": "Form 1 - Das ist nur ein Kratzer",
    "questions": {
      "name": "Wie heißt du?",
      "quest": "Was ist deine Suche?",
      "favorite-colour": "Was ist deine Lieblingsfarbe?",
      "laden-swallow-speed": "Wie hoch ist die durchschnittliche Luftgeschwindigkeit einer beladenen Schwalbe?"
    },
    "knights-title": "Die Ritter von Ni"
  }

  test("Basic tree, no base", () => {
    const helper = new TreeHelper(testObjectEn);
    const [tree, form] = helper.getTree();

    expect(tree.controlGroup).toBeDefined();

    expect(tree.children.length).toBe(4);
    expect(form.value.root).toEqual(testObjectEn);

    expect(tree.children[0].name).toBe('name');
    expect(tree.children[0].control.value).toContain('Form');
  });

  test("Basic tree, with base", () => {
    const helper = new TreeHelper(testObjectDe, testObjectEn);
    const [tree, form] = helper.getTree();

    expect(tree.controlGroup).toBeDefined();

    expect(tree.children.length).toBe(4);

    expect(tree.children[0].name).toBe('name');
    expect(tree.children[0].control.value).toContain('Form');

    expect(tree.children[0].baseValue).toContain("Form 1 - Tis");
    expect(tree.children[0].control.value).toContain("Form 1 - Das");
  });

  test("Basic tree, empty object", () => {
    const helper = new TreeHelper({});
    const [tree, form] = helper.getTree();
    
    expect(tree.controlGroup).toBeDefined();

    expect(tree.children.length).toBe(0);
    expect(form.value.root).toEqual({});
  });

});

describe("Searching", () => {

  test("Search on Current Value ", () => {
    const data = {
      name: 'form 1',
      foo: 'bar',
      deep: {
        name: 'How deep does this form it go?',
        label: "Who lives in a pineapple under the sea",
      }
    };

    const helper = new TreeHelper(data);
    const [tree, form] = helper.getTree();

    const result = TreeHelper.search("Form", tree.children);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("name");
    expect(result[0].control.value).toBe("form 1");

    expect(result[1].name).toBe("deep");
    expect(result[1].children.length).toBe(1);
    expect(result[1].children[0].name).toBe('name');
  });

  test("Search on Key name ", () => {
    const data = {
      name: 'form 1',
      foo: 'bar',
      deep: {
        name: 'How deep does this form it go?',
        label: "Who lives in a pineapple under the sea",
      }
    };

    const helper = new TreeHelper(data);
    const [tree, form] = helper.getTree();

    const result = TreeHelper.search("name", tree.children);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("name");

    expect(result[1].name).toBe("deep");
    expect(result[1].children.length).toBe(1);
    expect(result[1].children[0].name).toBe('name');
  });

  test("Search on base value", () => {
    const data = {
      name: 'form 1',
      foo: 'bar',
      deep: {
        name: 'How deep does this form it go?',
        label: "Who lives in a pineapple under the sea",
      }
    };
    const base = {
      name: 'El Formo Uno',
      foo: 'los barros',
      deep: {
        name: 'Que deep does this formo it go?',
        label: "Qierro lives in a pomelo under the sea",
      }
    };

    const helper = new TreeHelper(data, base);
    const [tree, form] = helper.getTree();

    const result = TreeHelper.search("formo", tree.children);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("name");

    expect(result[1].name).toBe("deep");
    expect(result[1].children.length).toBe(1);
    expect(result[1].children[0].name).toBe('name');
  });

})