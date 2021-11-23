import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

import { getTranslationDelta, URL_FRIENDLY_REGEX, getErrorMessage } from '../../../model/helpers';
import { Project } from '../../../model/Project';
import { TranslationPutBody, TranslationPatchBody } from '../../../model/Translation';
import { TranslationTreeNode, TreeHelper } from '../../../model/TreeHelper';
import { illegalValuesValidator } from '../../../model/Validators';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { InputDialogComponent, InputDialogData } from '../../dialogs/input-dialog/input-dialog.component';
import { TranslationViewParams } from '../../pages/translation-object/translation-object.component';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-translation-tree',
  templateUrl: './translation-tree.component.html',
  styleUrls: ['./translation-tree.component.scss']
})
export class TranslationTreeComponent implements OnInit {
  prefix = "tree.";

  treeControl = new NestedTreeControl<TranslationTreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TranslationTreeNode>();
  form: FormGroup;
  formDefault: any;
  tree: TranslationTreeNode;
  filtered: TranslationTreeNode[];
  // loading = true;

  private _loading = false;
  @Input() set loading(v: boolean) {
    this._loading = v;
    this.loadingChange.next(v);
  }
  get loading(): boolean {
    return this._loading;
  }
  @Output() loadingChange = new EventEmitter<boolean>();

  filterForm = new FormGroup({
    filter: new FormControl('all'),
    q: new FormControl(''),
  });

  @Input() viewForm: FormGroup;
  @Input() project: Project;

  constructor(
    private dialog: MatDialog,
    private toasts: MatSnackBar,
    private ps: ProjectsService,
  ) {
    this.filterForm.valueChanges
      .pipe(debounce(() => timer(250)))
      .subscribe(v => this.applyFilters());
  }

  ngOnInit() {
    //Set initial values from viewForm
    this.load();

    //Sub to viewForm changes
    this.viewForm.valueChanges.subscribe(v => this.load(v));
  }

  //Called whenever the selected lang/env/version changes.
  private load(params?: TranslationViewParams) {
    if (!params) params = this.viewForm.value;

    // //Merge them translations.
    const baseObject = this.project.getObject(params.env, this.project.defaultLang, params.version);
    const currentObject = this.project.getObject(params.env, params.lang, params.version);

    const helper = new TreeHelper(currentObject, baseObject);
    const [tree, form] = helper.getTree();
    this.form = form;
    this.tree = tree;
    this.formDefault = this.form.value;

    this.applyFilters();

    this.form.valueChanges.subscribe(v => {
      /* Disable view form when edits have been made. */
      if (this.form.pristine) {
        this.viewForm.enable({ emitEvent: false });
      } else {
        this.viewForm.disable({ emitEvent: false });
      }
    });

  }

  private getId(env: string, lang: string, version: number) {
    //If version is given, use that.
    if (version && version !== Infinity) return version;

    //Otherwise use the highest id of translations that fit the env and lang.
    const ids = this.project.translations
      .filter(t => t.env === env && t.lang === lang)
      .map(t => t.id)

    return Math.max(...ids);
  }

  async save() {
    this.loading = true;
    this.form.disable();

    const { env, lang, version } = this.viewForm.value;

    //Get the changed values
    const object = getTranslationDelta(this.formDefault.root, this.form.value.root);
    console.log(object);

    const data: TranslationPatchBody = {
      env, lang,
      id: this.getId(env, lang, version),
      object,
    };

    try {
      const t = await this.ps.updateTranslation(data);
      this.project.updateTranslation(t);
      this.load();
    } catch (err) {
      this.toasts.open(getErrorMessage(err));
    }
    this.loading = false;
    this.form.enable();
  }


  reset() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { prefix: this.prefix + 'confirm-reset.', alert: true },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) this.form.reset(this.formDefault);
    });
  }

  hasChild = (_: number, node: TranslationTreeNode) => !node.control;

  addGroup(node: TranslationTreeNode) {
    const data: InputDialogData = {
      prefix: this.prefix + 'add-group-dialog.',
      validators: [
        Validators.required,
        illegalValuesValidator(node.children.map(n => n.name)),
        Validators.pattern(URL_FRIENDLY_REGEX),
      ]
    };
    const dialog = this.dialog.open(InputDialogComponent, { data });

    dialog.afterClosed().subscribe(name => {
      if (!name) return;

      const newNode: TranslationTreeNode = {
        name,
        controlGroup: new FormGroup({}),
        missing: 0,
        children: [],
      };
      node.children.push(newNode);
      node.controlGroup.addControl(name, newNode.controlGroup);

      this.form.markAsDirty();
      this.applyFilters();
    });
  }

  addString(node: TranslationTreeNode) {
    const data: InputDialogData = {
      prefix: this.prefix + 'add-string-dialog.',
      validators: [
        Validators.required,
        illegalValuesValidator(node.children.map(n => n.name)),
        Validators.pattern(URL_FRIENDLY_REGEX),
      ]
    };
    const dialog = this.dialog.open(InputDialogComponent, { data });

    dialog.afterClosed().subscribe(name => {
      if (!name) return;

      const newNode: TranslationTreeNode = {
        name,
        control: new FormControl(''),
        baseValue: null,
        hasBaseValue: false,
        missing: 1,
      };
      console.log(node);
      node.children.push(newNode);
      node.controlGroup.addControl(name, newNode.control);
      this.form.markAsDirty();

      this.applyFilters();
    });
  }

  //Apply filters and refresh the tree list.
  private applyFilters() {
    const { filter, q } = this.filterForm.value;

    //Apply filters
    let nodes = this.tree.children;
    if (filter === "missing") {
      nodes = TreeHelper.filterMissing(nodes);
    } else if (filter === "changed") {
      nodes = TreeHelper.filterChanged(nodes);
    }

    //Apply search terms
    if (q) {
      nodes = TreeHelper.search(q, nodes);
    }

    //Show remaining nodes
    this.filtered = nodes;

    //Stupid workaround to avoid bugs
    //https://github.com/angular/components/issues/11381
    this.dataSource.data = null;

    this.dataSource.data = this.filtered;
    this.treeControl.dataNodes = this.filtered;
  }

}
