import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class PaginatorIntl implements MatPaginatorIntl {
  prefix = 'paginator.';

  firstPageLabel: string;
  itemsPerPageLabel: string;
  lastPageLabel: string;
  nextPageLabel: string;
  previousPageLabel: string;
  changes = new Subject<void>();

  constructor(private tx: TranslateService) {
    tx.get(`${this.prefix}first-page`).subscribe(x => {
      this.firstPageLabel = x;
      this.changes.next();
    });

    tx.get(`${this.prefix}last-page`).subscribe(x => {
      this.lastPageLabel = x;
      this.changes.next();
    });

    tx.get(`${this.prefix}next-page`).subscribe(x => {
      this.nextPageLabel = x;
      this.changes.next();
    });

    tx.get(`${this.prefix}prev-page`).subscribe(x => {
      this.previousPageLabel = x;
      this.changes.next();
    });

    tx.get(`${this.prefix}per-page`).subscribe(x => {
      this.itemsPerPageLabel = x;
      this.changes.next();
    });
  }


  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return this.tx.instant(`${this.prefix}page-1-of-1`);
    }
    const amountPages = Math.ceil(length / pageSize);
    return this.tx.instant(`${this.prefix}page-x-of-y`, { x: page + 1, y: amountPages });
  }
}
