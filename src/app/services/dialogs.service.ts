import { ComponentType } from '@angular/cdk/portal';
import { Injectable, ɵComponentType } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Deferred } from '../../model/util/Deferred';
import {
  ConfirmDialogData,
  ConfirmComponent,
} from '../dialogs/confirm/confirm.component';

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  constructor(private dialogs: MatDialog) {}

  async open<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D>
  ): Promise<R> {
    const d = new Deferred<R>();
    const ref = this.dialogs.open<T, D, R>(component, config);
    ref.afterClosed().subscribe((v) => d.resolve(v));

    return d.promise;
  }

  confirm(prefix: string, params?: unknown): Promise<boolean> {
    const data: ConfirmDialogData = { prefix, params };
    return this.open<ConfirmComponent, ConfirmDialogData, boolean>(
      ConfirmComponent,
      { data }
    );
  }

  confirmAlert(prefix: string, params?: unknown): Promise<boolean> {
    const data: ConfirmDialogData = { prefix, params, alert: true };
    return this.open<ConfirmComponent, ConfirmDialogData, boolean>(
      ConfirmComponent,
      { data }
    );
  }
}
