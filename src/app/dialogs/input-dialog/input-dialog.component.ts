import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent implements OnInit {
  get prefix() {
    return this.data.prefix;
  }

  get showContent() {
    return this.data.showContent;
  }

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData
  ) {
    if (!data) data = {};
    this.data = { ...defaultData, ...data };

    this.form = new FormGroup({
      control: new FormControl(data.defaultValue, data.validators)
    });
  }

  ngOnInit(): void {
  }

  getErrors() {
    const errors = this.form.get('control').errors;
    if (!errors) return [];
    return Object.keys(errors);
  }

  confirm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.dialogRef.close(this.form.value.control);
  }

  cancel() {
    this.dialogRef.close();
  }
}

export interface InputDialogData {
  prefix?: string;
  params?: any;
  showContent?: boolean;
  defaultValue?: string;
  validators?: ValidatorFn[];
}

const defaultData: InputDialogData = {
  prefix: 'input-dialog.',
  defaultValue: '',
  params: {},
  validators: [Validators.required],
}