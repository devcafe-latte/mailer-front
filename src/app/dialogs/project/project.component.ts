import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/model/Project';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { URL_FRIENDLY_REGEX } from 'src/model/helpers';
import { LOCALE_STRING_REGEX, getErrorMessage } from '../../../model/helpers';
import { ProjectsService } from '../../services/projects.service';
import { ToastsService } from '../../services/toasts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  prefix = 'projects.dialog.';
  form: FormGroup;
  loading = false;

  get editMode(): boolean {
    return Boolean(this.project.id);
  }

  constructor(
    private ps: ProjectsService,
    private dialogRef: MatDialogRef<ProjectComponent>,
    private toasts: ToastsService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public project?: Project
  ) {
    if (!this.project) {
      this.project = new Project();
      this.project.name = 'my-project';
      this.project.defaultEnv = 'test';
      this.project.defaultLang = 'en';
    }

    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl(null, Validators.pattern(URL_FRIENDLY_REGEX)),
      defaultEnv: new FormControl(null, Validators.pattern(URL_FRIENDLY_REGEX)),
      defaultLang: new FormControl(
        null,
        Validators.pattern(LOCALE_STRING_REGEX)
      ),
    });
    this.form.reset(this.project);
  }

  ngOnInit(): void {}

  getError(controlName: string) {
    const errors = this.form.get(controlName).errors;
    if (!errors) return '';
    return Object.keys(errors)[0];
  }

  async confirm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;

    try {
      if (this.editMode) {
        const project = await this.ps.updateProject(this.form.value);
        this.router.navigate(['/projects', this.form.value.name]);
        this.dialogRef.close(project);
      } else {
        const project = await this.ps.createProject(this.form.value);
        this.dialogRef.close(project);
      }
    } catch (err) {
      const code = getErrorMessage(err);
      if (code === 'project-name-taken') {
        this.form.get('name').setErrors({ 'name-taken': true });
      }

      this.toasts.error(err);
    }
    this.loading = false;
  }

  cancel() {
    this.dialogRef.close();
  }
}
