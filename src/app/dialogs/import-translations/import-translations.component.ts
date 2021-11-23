import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as YAML from 'yaml';

import { Translation, TranslationPutBody } from '../../../model/Translation';
import { ProjectsService } from '../../services/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getErrorMessage } from '../../../model/helpers';

@Component({
  selector: 'app-import-translations',
  templateUrl: './import-translations.component.html',
  styleUrls: ['./import-translations.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImportTranslationsComponent implements OnInit {
  prefix = "translations.import-dialog.";

  yaml: string;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<ImportTranslationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImportTranslationsData,
    private ps: ProjectsService,
    private toasts: MatSnackBar,
  ) {
    this.yaml = YAML.stringify(data.translation.object);
  }

  ngOnInit() {
  }

  async save() {
    this.loading = true;
    const t: TranslationPutBody = {
      ...this.data.translation
    };

    try {
      const result = await this.ps.replaceTranslation(t);
      this.dialogRef.close(result);
    } catch (err) {
      this.toasts.open(getErrorMessage(err));
    }
    this.loading = false;
  }

}

interface ImportTranslationsData {
  translation: Translation;
}