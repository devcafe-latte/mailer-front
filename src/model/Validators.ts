import { AbstractControl } from '@angular/forms';

export function illegalValuesValidator(illegalValues: string[]) {

  return (control: AbstractControl) => {
    const v = control.value;
    if (v ===  undefined || v === null || v === "") return null;

    if (typeof v !== "string") return null;

    if (illegalValues.indexOf(v) === -1) return null;

    return { 'illegal-value': true }
  };
}