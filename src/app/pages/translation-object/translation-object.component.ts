import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as YAML from 'yaml';

import { getErrorMessage, parseJsonOrYaml } from '../../../model/helpers';
import { Project } from '../../../model/Project';
import { ProjectsService } from '../../services/projects.service';
import { ImportTranslationsComponent } from '../../dialogs/import-translations/import-translations.component';
import { Translation } from '../../../model/Translation';

@Component({
  selector: 'app-translation-object',
  templateUrl: './translation-object.component.html',
  styleUrls: ['./translation-object.component.scss']
})
export class TranslationObjectComponent implements OnInit {
  prefix = "translations.";

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  loading = true;
  infinity = Infinity;

  project: Project;

  viewForm = new FormGroup({
    lang: new FormControl(),
    env: new FormControl(),
    version: new FormControl()
  });


  constructor(
    private ps: ProjectsService,
    private route: ActivatedRoute,
    private toasts: MatSnackBar,
    private dialog: MatDialog,
  ) {
    route.queryParams.subscribe(params => {
      this.setForm({ ...params })
    });
  }

  async ngOnInit() {
    try {
      this.project = await this.ps.getProject(this.route.snapshot.params.name);
      this.loading = false;

      //debug
      // this.openImportDialog(this.project.translations[0].object);

    } catch (err) {
      this.toasts.open(getErrorMessage(err));
      console.error(err);
    }
  }

  setForm(params: TranslationViewParams) {
    if (!params) params = {};
    if (!params.env) params.env = this.project.defaultEnv;
    if (!params.lang) params.lang = this.project.defaultLang;
    if (!params.version) params.version = Infinity;
    params.version = Number(params.version);

    this.viewForm.setValue(params);
  }

  uploadFile(event: Event) {
    //todo remind that changes will be discarded.

    const target = event.target as HTMLInputElement;
    if (!target.files.length) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const result = e.target.result;
      try {
        const object = parseJsonOrYaml(result);
        this.openImportDialog(object);
      } catch (err) {
        this.toasts.open("Cannot import. File is neither valid YAML nor JSON.");
      }
    };
    reader.readAsText(target.files[0]);

  }

  private openImportDialog(object: any) {
    const { env, lang, version } = this.viewForm.value;

    const t = new Translation();
    t.id = this.getId(env, lang, version);
    t.projectId = this.project.id;
    t.env = env;
    t.lang = lang;
    t.object = object;

    const ref = this.dialog.open(ImportTranslationsComponent, { data: { translation: t } });
    ref.afterClosed().subscribe((result) => {
      this.fileInput.nativeElement.value = '';

      if (!result) return;
      this.project.updateTranslation(result);
      //Force a reset of the editors
      this.viewForm.setValue(this.viewForm.value);
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

  export(type: 'yaml' | 'json') {
    //todo remind user to save first

    const { env, lang, version } = this.viewForm.value;
    const obj = this.project.getObject(env, lang, version);

    let content: string;
    let filetype: string;
    if (type === "json") {
      content = JSON.stringify(obj, null, 2);
      filetype = "application/json;charset=utf-8";
    } else {
      content = YAML.stringify(obj);
      filetype = "text/plain;charset=utf-8";
      console.log(content);
    }
    let file = new File([content], `${this.project.name}-${env}-${lang}-${version}.${type}`, { type: filetype });
    FileSaver.saveAs(file);
  }

}

export interface TranslationViewParams {
  env?: string;
  lang?: string;
  version?: number;
}