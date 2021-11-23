import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {

    if (!data) data = {};
    this.data = { ...defaultData, ...data };
  }

  ngOnInit(): void {
  }

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

}

export interface ConfirmDialogData {
  prefix?: string;
  params?: any;
  alert?: boolean;
}

const defaultData: ConfirmDialogData = {
  prefix: 'confirm-dialog.',
  params: {},
  alert: false,
}