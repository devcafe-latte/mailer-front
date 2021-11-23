import { Component, Input, OnInit } from '@angular/core';
import { TranslationTreeNode } from '../../../model/TreeHelper';
import { FormControl } from '@angular/forms';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';

@Component({
  selector: 'app-translation-node',
  templateUrl: './translation-node.component.html',
  styleUrls: ['./translation-node.component.scss']
})
export class TranslationNodeComponent implements OnInit {
  prefix = "tree-node.";
  showTextarea = false;

  oldValue: string = null;

  get isRemoved() {
    return this.oldValue !== null;
  }

  @Input() node: TranslationTreeNode;

  get control(): FormControl {
    return this.node.control;
  }

  constructor() { }

  ngOnInit(): void {
    //decide to show textarea of input
    const v = String(this.node.control.value);
    if (v.length > 50) this.showTextarea = true;
  }

  remove() {
    this.oldValue = this.node.control.value;
    this.node.control.setValue(null);
    this.node.control.markAsDirty();
  }

  restore() {
    this.node.control.setValue(this.oldValue);
    this.oldValue = null;
    this.node.control.markAsDirty();
  }
}
