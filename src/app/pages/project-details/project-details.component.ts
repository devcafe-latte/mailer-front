import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../model/Project';
import { ProjectsService } from '../../services/projects.service';
import { getErrorMessage } from '../../../model/helpers';
import { MatTableDataSource } from '@angular/material/table';
import { Translation } from '../../../model/Translation';
import { MatSort } from '@angular/material/sort';
import { DialogsService } from '../../services/dialogs.service';
import { ProjectComponent } from '../../dialogs/project/project.component';
import { ToastsService } from '../../services/toasts.service';
import { FormControl } from '@angular/forms';
import {
  TranslationDialogComponent,
  TranslationDialogData,
} from '../../dialogs/translation-dialog/translation-dialog.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit, AfterViewInit {
  prefix = 'projects.details.';

  project: Project;
  @ViewChild(MatSort) sort: MatSort;

  tableCols = ['id', 'env', 'lang', 'updated'];
  dataSource = new MatTableDataSource<Translation>();

  showDeleted = new FormControl(false);

  constructor(
    private ps: ProjectsService,
    private route: ActivatedRoute,
    private toasts: ToastsService,
    private dialogs: DialogsService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.dataSource.filterPredicate = (t, filter) => {
      if (this.showDeleted.value) return true;
      if (t.deleted === null) return true;

      return false;
    };
    this.showDeleted.valueChanges.subscribe(
      () => (this.dataSource.filter = String(Math.random()))
    );

    try {
      this.project = await this.ps.getProject(this.route.snapshot.params.name);
      this.dataSource.data = this.project.translations;
      this.dataSource.filter = String(Math.random());
    } catch (err) {
      this.toasts.error(err);
    }
  }

  async restoreProject() {
    const confirmed = await this.dialogs.confirm(
      this.prefix + 'restore-project-confirm.', this.project
    );
    if (!confirmed) return;

    try {
      const result = await this.ps.updateProject({ id: this.project.id, restore: true });
      this.project.deleted = result.deleted;
    } catch (error) {
      this.toasts.error(error);
    }
  }

  async restoreTranslation(t: Translation) {
    const confirmed = await this.dialogs.confirm(
      this.prefix + 'restore-translation-confirm.',
      t
    );
    if (!confirmed) return;

    try {
      const result = await this.ps.updateTranslation({ id: t.id, restore: true });
      t.deleted = result.deleted;
    } catch (error) {
      this.toasts.error(error);
    }
  }

  async deleteTranslation(t: Translation) {
    const confirmed = await this.dialogs.confirmAlert(
      this.prefix + 'delete-translation-confirm.',
      t
    );
    if (!confirmed) return;

    try {
      const result = await this.ps.deleteTranslation(t);
      t.deleted = result.deleted;
      this.dataSource.filter = String(Math.random());
    } catch (error) {
      this.toasts.error(error);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async newTranslation() {
    const data: TranslationDialogData = {
      project: this.project,
    };

    const result = await this.dialogs.open(TranslationDialogComponent, {
      data,
    });
    if (!result) return;
    this.project.translations.push(result);
  }

  async edit() {
    const result = await this.dialogs.open<ProjectComponent, any, Project>(
      ProjectComponent,
      { data: this.project }
    );

    if (!result) return;
    this.project.name = result.name;
    this.project.defaultLang = result.defaultLang;
    this.project.defaultEnv = result.defaultEnv;
  }

  async delete() {
    const confirmed = await this.dialogs.confirmAlert(
      this.prefix + 'delete-confirm.',
      this.project
    );
    if (!confirmed) return;

    try {
      await this.ps.deleteProject(this.project);
      this.router.navigate(['../']);
    } catch (err) {
      this.toasts.error(err);
    }
  }
}
