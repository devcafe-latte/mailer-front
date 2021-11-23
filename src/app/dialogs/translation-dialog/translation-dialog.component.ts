import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { LOCALE_STRING_REGEX, URL_FRIENDLY_REGEX, getErrorMessage } from '../../../model/helpers';
import { Project } from '../../../model/Project';
import { Translation } from '../../../model/Translation';
import { ProjectsService } from '../../services/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-translation-dialog',
  templateUrl: './translation-dialog.component.html',
  styleUrls: ['./translation-dialog.component.scss']
})
export class TranslationDialogComponent implements OnInit {
  prefix = 'translations.new-dialog.';

  form: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private toast: MatSnackBar,
    private ps: ProjectsService,
    private dialogRef: MatDialogRef<TranslationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TranslationDialogData
  ) {
    if (!this.data.translation) {
      this.data.translation = new Translation();
      this.data.translation.env = this.data.project.defaultEnv;
      this.data.translation.lang = this.data.project.defaultLang;
      this.data.translation.projectId = this.data.project.id;
      this.data.translation.object = {};
    }

    this.form = new FormGroup({
      id: new FormControl(),
      projectId: new FormControl(),
      env: new FormControl(null, Validators.pattern(URL_FRIENDLY_REGEX)),
      lang: new FormControl(null, Validators.pattern(LOCALE_STRING_REGEX)),
      object: new FormControl(null),
    });
    this.form.reset(this.data.translation);
  }

  ngOnInit(): void {
  }

  async confirm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const t = await this.ps.createTranslation(this.form.value);
      this.dialogRef.close(t);
  
      this.router.navigate(['/projects', this.data.project.name, 'object'], { queryParams: { version: t.id, env: t.env, lang: t.lang } })
    } catch (err) {
      this.toast.open(getErrorMessage(err));
    }

    this.loading = false;
  }

  cancel() {
    this.dialogRef.close();
  }

  /**
   * Check to see if the proposed new Translation has an envand lang that already exist
   *
   * @returns
   * @memberof TranslationDialogComponent
   */
  getNotice() {
    const hasLang = this.data.project.langs.includes(this.form.value.lang);
    const hasEnv = this.data.project.envs.includes(this.form.value.env);

    let text: string;
    if (!hasLang && !hasEnv) {
      text = 'new-env-and-lang';
    } else if (!hasLang) {
      text = 'new-lang';
    } else if (!hasEnv) {
      text = 'new-env';
    } else {
      text = 'new-version';
    }
    return this.prefix + text;
  }
}

export interface TranslationDialogData {
  project: Project;
  translation?: Translation;
}