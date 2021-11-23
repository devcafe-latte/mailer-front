import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { getErrorMessage } from '../../../model/helpers';
import { Project } from '../../../model/Project';
import { Page } from '../../../model/util/Page';
import { ProjectComponent } from '../../dialogs/project/project.component';
import { ProjectsService } from '../../services/projects.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  prefix = 'projects.';

  form: FormGroup;

  page: Page<Project>;

  constructor(
    private toasts: MatSnackBar,
    private ps: ProjectsService,
    public dialog: MatDialog
  ) {
    this.form = new FormGroup({
      page: new FormControl(0),
      showDeleted: new FormControl(false),
      projectName: new FormControl(null),
      orderBy: new FormControl('name'),
      orderAsc: new FormControl(true),
    });
  }

  async ngOnInit() {
    this.search();
  }

  toggleAsc(event) {
    event.stopPropagation();
    this.form.get('orderAsc').setValue(!this.form.get('orderAsc').value);
  }

  async search() {
    try {
      this.page = await this.ps.getProjects(this.form.value);
    } catch (err) {
      this.toasts.open(getErrorMessage(err));
    }
  }

  reset() {
    this.form.reset({
      page: 0,
      showDeleted: false,
      projectName: null,
      orderBy: 'name',
      orderAsc: true,
    });
    this.search();
  }

  pageChange(event: PageEvent) {
    this.form.get('page').setValue(event.pageIndex);
    this.search();
  }

  add() {
    const dialogRef = this.dialog.open(ProjectComponent);
    dialogRef.afterClosed().subscribe((project) => {
      if (!project) return;
      console.log(project);
      this.page.items.unshift(project);
    });
  }
}
