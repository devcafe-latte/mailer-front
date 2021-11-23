import { FormControl, FormGroup } from '@angular/forms';
import { merge } from 'lodash-es';

export class TreeHelper {
  formGroup: FormGroup = new FormGroup({});

  private merged: MergableTranslationTreeNode;

  constructor(public current: any, public base?: any) {
    this.toTreeNodes();
  }

  getTree(): [TranslationTreeNode, FormGroup] {
    return [this.buildTree(this.merged, this.formGroup), this.formGroup];
  }

  private toTreeNodes(depth = 0) {
    if (depth > 100) throw "It's too deep!";

    const currentTree = this.objectToTreeNodes(this.current, false);
    if (!this.base) {
      this.merged = currentTree;
      return;
    }

    const baseTree = this.objectToTreeNodes(this.base, true);
    this.merged = merge({}, currentTree, baseTree);
  }

  private objectToTreeNodes(data: any, isBase: Boolean, depth = 0) {
    if (depth > 100) throw "It's too deep!";

    const tree: MergableTranslationTreeNode = {
      name: 'root',
      childrenHash: {},
    };

    for (let k of Object.keys(data)) {
      const d = data[k];
      let node: MergableTranslationTreeNode;

      if (typeof d === 'object') {
        //Create a new tree
        node = this.objectToTreeNodes(d, isBase, depth + 1);
        node.name = k;
      } else if (isBase) {
        node = { name: k, baseValue: String(d), hasBaseValue: true };
      } else {
        node = { name: k, value: String(d), hasCurrentValue: true };
      }

      tree.childrenHash[node.name] = node;
    }

    return tree;
  }

  private buildTree(
    input: MergableTranslationTreeNode,
    form: FormGroup
  ): TranslationTreeNode {
    const tree: TranslationTreeNode = {
      name: input.name,
      missing: 0,
    };

    if (input.childrenHash !== undefined) {
      tree.children = [];

      const newGroup = new FormGroup({});
      tree.controlGroup = newGroup;
      form.addControl(input.name, newGroup);

      for (let c of Object.values(input.childrenHash)) {
        const node = this.buildTree(c, newGroup);
        tree.missing += node.missing;
        tree.children.push(node);
      }
    } else {
      tree.control = new FormControl(input.value);
      tree.baseValue = input.baseValue;
      tree.hasBaseValue = Boolean(input.hasBaseValue);
      tree.missing = input.hasCurrentValue ? 0 : 1;

      form.addControl(input.name, tree.control);
    }

    return tree;
  }

  static filterMissing(nodes: TranslationTreeNode[]): TranslationTreeNode[] {
    const result = [];
    for (let n of nodes) {
      if (n.missing === 0) continue;

      if (n.children) {
        const newNode = { ...n, children: this.filterMissing(n.children) };
        result.push(newNode);
      } else {
        result.push({ ...n });
      }
    }

    return result;
  }

  static search(
    q: string,
    nodes: TranslationTreeNode[]
  ): TranslationTreeNode[] {
    if (!q) return nodes;
    q = q.toLowerCase();

    const result = [];
    for (let n of nodes) {
      //if name matches, add and continue.
      if (
        n.name.toLowerCase().includes(q) ||
        (n.control &&
          n.control.value &&
          String(n.control.value).toLowerCase().includes(q)) ||
        (n.hasBaseValue && n.baseValue.toLowerCase().includes(q))
      ) {
        result.push({ ...n });
      } else if (n.children) {
        const newNode = { ...n, children: this.search(q, n.children) };
        if (newNode.children.length) result.push(newNode);
      }
    }

    return result;
  }

  static filterChanged(nodes: TranslationTreeNode[]): TranslationTreeNode[] {
    const result = [];
    for (let n of nodes) {
      if (n.children) {
        const newNode = { ...n, children: this.filterChanged(n.children) };
        if (newNode.children.length > 0) result.push(newNode);
      } else if (!n.control.pristine) {
        result.push({ ...n });
      }
    }

    return result;
  }
}

interface MergableTranslationTreeNode {
  name: string;
  value?: string;
  baseValue?: string;
  childrenHash?: { [key: string]: MergableTranslationTreeNode };
  hasCurrentValue?: boolean;
  hasBaseValue?: boolean;
}

export interface TranslationTreeNode {
  name: string;
  missing?: number;
  control?: FormControl;
  controlGroup?: FormGroup;
  baseValue?: string;
  children?: TranslationTreeNode[];
  // hasCurrentValue?: boolean;
  hasBaseValue?: boolean;
}
