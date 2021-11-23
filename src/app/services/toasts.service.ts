import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { getErrorMessage } from '../../model/helpers';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  constructor(private snackbar: MatSnackBar, private tx: TranslateService) {}

  error(object: unknown, prefix = 'toasts.errors.') {
    if (!prefix) prefix = '';
    const error = getErrorMessage(object);
    this.snackbar.open(this.tx.instant(`${prefix}${error}`));
  }

  open(text: string, prefix = 'toasts.') {
    if (!prefix) prefix = '';
    this.snackbar.open(this.tx.instant(`${prefix}${text}`));
  }
}
