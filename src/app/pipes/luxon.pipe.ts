import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'luxon'
})
export class LuxonPipe implements PipeTransform {

  transform(value: DateTime | number | any): string | null {
    if (!value) return null;

    if (DateTime.isDateTime(value)) {
      return value.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    } else if (!isNaN(value as any)) {
      console.log(value);
      return DateTime.fromSeconds(value).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    }

    return value;
  }

}
